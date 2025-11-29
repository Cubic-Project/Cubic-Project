import { 
    converter, 
    formatHex, 
    toGamut, 
    parse,
    type Oklch,
    type Color
} from 'culori';
import { calcAPCA } from 'apca-w3';
import type { ColorData, SceneType, SceneConfig, AnalysisIssue, HarmonyAnalysis, PaletteVariation } from '../types';

// 初始化转换器
const toOklch = converter('oklch') as (c: string | Color) => Oklch;
const toRgb = converter('rgb');
const rgbGamut = toGamut('rgb', 'oklch');

// 导出类型
export type { SceneType };

// 场景定义常量
export const SCENES: Record<SceneType, SceneConfig> = {
    light: {
        id: 'light',
        nameKey: 'scene_light',
        descKey: 'scene_light_desc',
        icon: 'Sun',
        targetL: null,
        apcaTarget: { min: 60, max: 95, optimal: 75, reference: 'white' },
        usageKey: 'scene_light_usage'
    },
    normal: {
        id: 'normal',
        nameKey: 'scene_normal',
        descKey: 'scene_normal_desc',
        icon: 'Circle',
        targetL: null, // 动态跟随基准色
        apcaTarget: null,
        usageKey: 'scene_normal_usage'
    },
    contrast: {
        id: 'contrast',
        nameKey: 'scene_contrast',
        descKey: 'scene_contrast_desc',
        icon: 'Zap',
        targetL: null,
        apcaTarget: { min: 90, max: 100, optimal: 95, reference: 'white' },
        usageKey: 'scene_contrast_usage'
    }
};

// 辅助函数：二分查找目标 APCA 的 L 值
function findLForApca(originalOklch: Oklch, targetLcMag: number, reference: 'black' | 'white'): number {
    const refHex = reference === 'black' ? '#000000' : '#ffffff';
    let min = 0;
    let max = 1;
    let bestL = originalOklch.l;
    let minDiff = Infinity;

    // 20 iterations gives enough precision
    for(let i=0; i<20; i++) {
        const mid = (min + max) / 2;
        const candidate = { ...originalOklch, l: mid };
        const hex = formatHex(rgbGamut(candidate));
        const lc = calcAPCA(hex, refHex) as number;
        const mag = Math.abs(lc);
        const diff = Math.abs(mag - targetLcMag);
        
        if (diff < minDiff) {
            minDiff = diff;
            bestL = mid;
        }
        
        if (diff < 0.01) break;

        // Determine direction
        if (reference === 'black') {
             // Against black: Higher L -> Higher Contrast
             if (mag < targetLcMag) min = mid;
             else max = mid;
        } else {
             // Against white: Lower L -> Higher Contrast (magnitude)
             if (mag < targetLcMag) max = mid;
             else min = mid;
        }
    }
    return bestL;
}

// 颜色处理工具函数
export function createColorData(hex: string, id: string, source: 'user' | 'adjusted' = 'user'): ColorData {
    const oklch = toOklch(hex);
    return {
        id,
        hex: formatHex(hex) ?? '#000000',
        oklch,
        source
    };
}

export function isValidHex(hex: string): boolean {
    return !!parse(hex);
}

export function extractHexCodes(input: string): string[] {
    // Matches hex codes with or without #, 3, 6, or 8 digits
    // \b ensures word boundary to avoid partial matches inside other words if possible,
    // but hex codes can be adjacent to punctuation.
    // The regex below captures:
    // # followed by 3, 4, 6, or 8 hex digits
    // OR
    // 3, 4, 6, or 8 hex digits preceded by a word boundary or whitespace
    
    const regex = /#?([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
    const matches = input.match(regex);
    
    if (!matches) return [];

    return matches.map(match => {
        // Ensure it starts with #
        let hex = match;
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }
        // Validate with culori to be sure
        if (isValidHex(hex)) {
            return formatHex(hex);
        }
        return null;
    }).filter((c): c is string => c !== null);
}

// APCA 对比度计算
export function getApcaContrast(textColor: string, bgColor: string): number {
    return calcAPCA(textColor, bgColor) as number;
}

export function getApcaRating(score: number): string {
    const absScore = Math.abs(score);
    if (absScore >= 90) return 'AAA (Preferred)';
    if (absScore >= 75) return 'AAA (Body Text)';
    if (absScore >= 60) return 'AA (Readable)';
    if (absScore >= 45) return 'AA (Large Text)';
    if (absScore >= 30) return 'A (Spot Text)';
    return 'Fail';
}

// 自动调整逻辑
export function adjustColorsToScene(
    colors: ColorData[],
    sceneId: SceneType,
    referenceId: string | null
): ColorData[] {
    if (!colors.length) return [];

    const scene = SCENES[sceneId];
    const refColor = colors.find(c => c.id === referenceId) || colors[0];
    
    // 1. Determine targets
    let targetL = refColor.oklch.l;
    let targetApcaMag: number | null = null;

    if (scene.apcaTarget) {
        const refHex = scene.apcaTarget.reference === 'white' ? '#ffffff' : '#000000';
        // Calculate current APCA of reference color
        const refLc = calcAPCA(refColor.hex, refHex) as number;
        const currentMag = Math.abs(refLc);
        
        // Clamp to scene limits. Add small buffer to min to ensure we don't fall just below due to precision
        targetApcaMag = Math.max(scene.apcaTarget.min + 0.2, Math.min(scene.apcaTarget.max, currentMag));
    } else if (scene.targetL) {
        // Legacy fallback
        targetL = Math.max(scene.targetL.min, Math.min(scene.targetL.max, targetL));
    }
    
    // 2. Adjust all colors
    return colors.map(color => {
        let finalL = targetL;

        if (scene.apcaTarget && targetApcaMag !== null) {
            finalL = findLForApca(color.oklch, targetApcaMag, scene.apcaTarget.reference);
        } else if (scene.id === 'normal') {
            // Normal scene: keep original lightness
            finalL = color.oklch.l;
        } else if (scene.targetL) {
             // Legacy scene with targetL
             finalL = targetL;
        }

        const newOklch = { ...color.oklch, l: finalL };
        // Gamut mapping
        const gamutedColor = rgbGamut(newOklch);
        const newHex = formatHex(gamutedColor);

        return {
            ...color,
            hex: newHex,
            oklch: toOklch(newHex),
            source: 'adjusted'
        };
    });
}

// 分析逻辑
export function analyzeHarmony(
    colors: ColorData[],
    sceneId: SceneType
): HarmonyAnalysis {
    const issues: AnalysisIssue[] = [];
    const scene = SCENES[sceneId];
    
    // 1. 检查一致性 (APCA mode should check APCA consistency, but we'll stick to L consistency as proxy for now)
    const lValues = colors.map(c => c.oklch.l);
    const avgL = lValues.reduce((a, b) => a + b, 0) / (lValues.length || 1);
    const variance = lValues.reduce((a, b) => a + Math.pow(b - avgL, 2), 0) / (lValues.length || 1);
    const stdDev = Math.sqrt(variance);
    
    // Allow slightly more deviation if using APCA as hues affect L
    const primaryConsistency = stdDev < 0.08;

    if (!primaryConsistency && colors.length > 1) {
        issues.push({
            type: 'warning',
            message: 'analysis_primary_inconsistency'
        });
    }

    // 2. 检查场景符合度
    let targetLCompliance = true;
    
    if (scene.apcaTarget) {
        const refHex = scene.apcaTarget.reference === 'white' ? '#ffffff' : '#000000';
        const outOfBounds = colors.filter(c => {
            const lc = calcAPCA(c.hex, refHex) as number;
            const mag = Math.abs(lc);
            // Allow small epsilon
            return mag < scene.apcaTarget!.min - 1 || mag > scene.apcaTarget!.max + 1;
        });

        if (outOfBounds.length > 0) {
             targetLCompliance = false;
             issues.push({
                type: 'warning',
                message: 'analysis_target_noncompliance',
                value: outOfBounds.length
            });
        }
    } else if (scene.targetL) {
        const outOfBounds = colors.filter(c => c.oklch.l < scene.targetL!.min || c.oklch.l > scene.targetL!.max);
        if (outOfBounds.length > 0) {
            targetLCompliance = false;
            issues.push({
                type: 'warning',
                message: 'analysis_target_noncompliance',
                value: outOfBounds.length
            });
        }
    }

    return {
        primaryConsistency,
        targetLCompliance,
        issues
    };
}

// Helper to convert "R G B" string to Hex
export function rgbStringToHex(rgbString: string): string {
    const parts = rgbString.split(' ').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return '#000000';
    const [r, g, b] = parts;
    return formatHex({ mode: 'rgb', r: r/255, g: g/255, b: b/255 });
}

// Helper to convert Hex to "R G B" string
export function hexToRgbString(hex: string): string {
    const rgb = toRgb(hex);
    if (!rgb) return '0 0 0';
    return `${Math.round(rgb.r * 255)} ${Math.round(rgb.g * 255)} ${Math.round(rgb.b * 255)}`;
}

// Convert Theme colors to ColorData[]
export function themeToColorData(colors: Record<string, string>): ColorData[] {
    return Object.entries(colors).map(([key, value]) => {
        const hex = rgbStringToHex(value);
        return createColorData(hex, key);
    });
}

// Convert ColorData[] back to Theme colors format
export function colorDataToThemeColors(colorData: ColorData[]): Record<string, string> {
    const colors: Record<string, string> = {};
    colorData.forEach(c => {
        colors[c.id] = hexToRgbString(c.hex);
    });
    return colors;
}

export function generatePaletteVariations(primaryHex: string, sceneId: SceneType): PaletteVariation[] {
    const variations: PaletteVariation[] = [];

    // 1. Analogous (Default/Harmonious)
    const analogousColors = generatePalette(primaryHex, sceneId, 'analogous');
    variations.push({
        id: 'analogous',
        name: 'Harmonious',
        description: 'Smooth and comfortable transition',
        colors: colorDataToThemeColors(analogousColors),
        previewColors: []
    });

    // 2. Complementary (High Contrast)
    const complementaryColors = generatePalette(primaryHex, sceneId, 'complementary');
    variations.push({
        id: 'complementary',
        name: 'Vibrant',
        description: 'High contrast with complementary colors',
        colors: colorDataToThemeColors(complementaryColors),
        previewColors: []
    });

    // 3. Triadic (Balanced)
    const triadicColors = generatePalette(primaryHex, sceneId, 'triadic');
    variations.push({
        id: 'triadic',
        name: 'Balanced',
        description: 'Rich and balanced three-color scheme',
        colors: colorDataToThemeColors(triadicColors),
        previewColors: []
    });
    
    // 4. Monochromatic (Subtle)
    const monochromaticColors = generatePalette(primaryHex, sceneId, 'monochromatic');
    variations.push({
        id: 'monochromatic',
        name: 'Subtle',
        description: 'Clean single-hue variations',
        colors: colorDataToThemeColors(monochromaticColors),
        previewColors: []
    });

    // Fill preview colors
    variations.forEach(v => {
        v.previewColors = [
            rgbStringToHex(v.colors['primary']),
            rgbStringToHex(v.colors['secondary']),
            rgbStringToHex(v.colors['surface'])
        ];
    });

    return variations;
}

function generatePalette(primaryHex: string, sceneId: SceneType, type: 'analogous' | 'complementary' | 'triadic' | 'monochromatic'): ColorData[] {
    const primary = toOklch(primaryHex);
    const h = primary.h || 0;
    
    let secondaryH = h;
    let secondaryC = primary.c;
    
    switch (type) {
        case 'analogous': 
            secondaryH = h + 30; 
            break;
        case 'complementary': 
            secondaryH = h + 180; 
            break;
        case 'triadic': 
            secondaryH = h + 120; 
            break;
        case 'monochromatic': 
            secondaryH = h; 
            secondaryC = (primary.c || 0) * 0.5;
            break;
    }

    // Generate base colors for a Light Theme structure
    // We use the primary hue to tint the neutrals slightly
    const tintH = h;
    const tintC = 0.005;

    const bg = { mode: 'oklch', l: 0.99, c: tintC, h: tintH } as Oklch;
    const surface = { mode: 'oklch', l: 0.96, c: 0.01, h: tintH } as Oklch;
    const surfaceHover = { mode: 'oklch', l: 0.94, c: 0.015, h: tintH } as Oklch;
    
    // Secondary
    const secondary = { ...primary, c: secondaryC, h: secondaryH } as Oklch;
    
    // Text: Dark grey with slight tint
    const textMain = { mode: 'oklch', l: 0.20, c: 0.02, h: tintH } as Oklch;
    const textMuted = { mode: 'oklch', l: 0.55, c: 0.04, h: tintH } as Oklch;
    const border = { mode: 'oklch', l: 0.88, c: 0.02, h: tintH } as Oklch;
    
    // Primary Dark
    const primaryDark = { ...primary, l: Math.max(0.2, primary.l - 0.1) } as Oklch;

    const colors: ColorData[] = [
        createColorData(formatHex(rgbGamut(bg)) ?? '#ffffff', 'background', 'adjusted'),
        createColorData(formatHex(rgbGamut(surface)) ?? '#f5f5f5', 'surface', 'adjusted'),
        createColorData(formatHex(rgbGamut(surfaceHover)) ?? '#eeeeee', 'surface-hover', 'adjusted'),
        createColorData(primaryHex, 'primary', 'user'),
        createColorData(formatHex(rgbGamut(primaryDark)) ?? '#000000', 'primary-dark', 'adjusted'),
        createColorData(formatHex(rgbGamut(secondary)) ?? '#000000', 'secondary', 'adjusted'),
        createColorData(formatHex(rgbGamut(textMain)) ?? '#000000', 'text-main', 'adjusted'),
        createColorData(formatHex(rgbGamut(textMuted)) ?? '#666666', 'text-muted', 'adjusted'),
        createColorData(formatHex(rgbGamut(border)) ?? '#e0e0e0', 'border', 'adjusted'),
    ];

    // Apply scene adjustments ONLY to foreground/brand colors
    // Backgrounds should remain light to maintain the "Light Theme" structure
    const adjustList = ['primary', 'primary-dark', 'secondary'];
    
    const toAdjust = colors.filter(c => adjustList.includes(c.id));
    const others = colors.filter(c => !adjustList.includes(c.id));
    
    const adjusted = adjustColorsToScene(toAdjust, sceneId, 'primary');
    
    return [...others, ...adjusted];
}

export function generateHarmoniousPalette(primaryHex: string, sceneId: SceneType): ColorData[] {
    return generatePalette(primaryHex, sceneId, 'analogous');
}
