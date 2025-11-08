'use client';

import React from 'react';
import Link from 'next/link';
import type { ActivityType } from '@/services/ActivityService';

interface ActivityCardProps {
    activity: ActivityType;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
    // Helper function to generate tag colors
    const generateTagColors = (baseColor: string, count: number) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hueShift = (i * 30) % 360;
            colors.push(adjustHue(baseColor, hueShift));
        }
        return colors;
    };

    const tagColors = generateTagColors(activity.colors[1] || '#58DFAE', activity.tags?.length || 0);

    return (
        <div
            className="rounded-2xl overflow-hidden min-h-[180px] my-3 relative"
            style={{
                background: `linear-gradient(135deg, ${activity.colors[0] || '#D7FFF1'}, ${activity.colors[1] || '#58DFAE'})`
            }}
        >
            <Link href={`${activity.redirect}?id=${activity.$id}`}>
                <div className="flex flex-col p-5 pr-[30%] h-full">
                    {/* Text Content */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                {activity.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                {activity.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {activity.tags && activity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {activity.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full text-xs font-medium text-gray-900"
                                        style={{
                                            backgroundColor: tagColors[index],
                                            opacity: 0.8
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Play Button */}
                        <button className="bg-[#04714A] text-white rounded-xl flex items-center justify-center gap-2 py-2 px-4 w-fit min-w-[100px] hover:bg-[#03603a] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-sm">
                                {activity.duration || activity.time || 'Start'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Image */}
                {activity.imagepath && activity.imagepath.length > 0 && (
                    <div className="absolute right-0 top-0 bottom-0 w-[45%] flex items-center justify-center">
                        <img
                            src={activity.imagepath[0]}
                            alt={activity.title}
                            className="w-[90%] h-auto max-h-full object-contain"
                        />
                    </div>
                )}
            </Link>
        </div>
    );
};

// Helper function to adjust hue of a hex color
const adjustHue = (hex: string, degrees: number): string => {
    const hsl = hexToHSL(hex);
    hsl.h = (hsl.h + degrees) % 360;
    return HSLToHex(hsl);
};

// Helper functions for color conversion
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let r, g, b;
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16) / 255;
        g = parseInt(hex[1] + hex[1], 16) / 255;
        b = parseInt(hex[2] + hex[2], 16) / 255;
    } else {
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;
    }

    // Find min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const HSLToHex = (hsl: { h: number; s: number; l: number }): string => {
    let { h, s, l } = hsl;
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default ActivityCard;