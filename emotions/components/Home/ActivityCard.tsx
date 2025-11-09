import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Link, RelativePathString } from 'expo-router';
import type { ActivityCardProps } from '@/types/Activitys.types';

const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title = "Activity",
  description = "This is a sample activity description",
  tags = ["Meditation", "Sleep", "Calm"],
  duration = "45 min",
  image = require('@/assets/images/ActivityCard.png'),
  colors = ["#D7FFF1", "#58DFAE"],
  redirect = "/Trainings/trainingscreen",
  activitytype = "Exercise",
  difficulty = "Easy",
  onPress
}) => {
  const generateTagColors = (baseColor: string, count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hueShift = (i * 30) % 360;
      colors.push(adjustHue(baseColor, hueShift));
    }
    return colors;
  };

  const tagColors = generateTagColors(colors[1], tags.length);

  // Handle image source (local require or remote URL)
  const imageSource = typeof image === 'string'
    ? { uri: image }
    : image;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <TouchableOpacity onPress={onPress} style={styles.touchableArea}>
          <View style={styles.cardContent}>
            <View style={styles.textContent}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>

              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: tagColors[index],
                        opacity: 0.8,
                      }
                    ]}
                  >
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.playButton}>
                  <FontAwesome name='play-circle' size={20} color={"#ffffff"} />
                  <Text style={styles.playButtonText}>  {duration}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <ImageBackground
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

// Helper function to adjust hue of a hex color
const adjustHue = (hex: string, degrees: number) => {
  const hsl = hexToHSL(hex);
  hsl.h = (hsl.h + degrees) % 360;
  return HSLToHex(hsl);
};

// Helper functions for color conversion
const hexToHSL = (hex: string) => {
  let r = 0, g = 0, b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16) / 255;
    g = parseInt(hex[2] + hex[2], 16) / 255;
    b = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16) / 255;
    g = parseInt(hex[3] + hex[4], 16) / 255;
    b = parseInt(hex[5] + hex[6], 16) / 255;
  }

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
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

const HSLToHex = (hsl: { h: number, s: number, l: number }) => {
  let { h, s, l } = hsl;
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
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

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 180,
    marginVertical: 10,
  },
  gradientBackground: {
    flex: 1,
    padding: 0,
  },
  touchableArea: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: '30%',
  },
  textContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#6E6E6E',
    marginBottom: 12,
    lineHeight: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 9,
    color: '#000',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#04714A',
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 100,
  },
  playButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },
  imageContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '45%',
    justifyContent: 'center',
    alignItems: "center"
  },
  image: {
    width: '90%',
    height: '100%',
    aspectRatio: 1,
  },
});

export default ActivityCard;