import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CategoryCardProps } from '@/types/category.types';

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  icon,
  type,
  bgColor,
  iconBgColor,
  issueText,
  description,
  onPress,
  isActive = true
}) => {
  // Handle icon (could be string emoji or JSX element)
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <Text style={styles.emojiIcon}>{icon}</Text>
      );
    }
    return icon;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[bgColor, `${bgColor}DD`]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: iconBgColor || `${bgColor}80` }
          ]}>
            {renderIcon()}
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.issueText}>{issueText}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          {!isActive && (
            <View style={styles.inactiveOverlay}>
              <Text style={styles.inactiveText}>Coming Soon</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiIcon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  issueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});

export default CategoryCard;