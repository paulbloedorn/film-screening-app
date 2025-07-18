import { toast } from "@/hooks/use-toast";

// Error types for TinaCMS operations
export interface TinaError {
  message: string;
  code?: string;
  field?: string;
  type: 'validation' | 'network' | 'auth' | 'config' | 'unknown';
}

// Content validation utilities
export class TinaValidator {
  static validateRequired(value: any, fieldName: string): string | null {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
    if (value && value.length > maxLength) {
      return `${fieldName} must be ${maxLength} characters or less`;
    }
    return null;
  }

  static validateUrl(value: string, fieldName: string): string | null {
    if (!value || value.trim().length === 0) return null;
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const vimeoPattern = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
    
    if (!urlPattern.test(value) && !youtubePattern.test(value) && !vimeoPattern.test(value)) {
      return `${fieldName} must be a valid URL (YouTube, Vimeo, or direct link)`;
    }
    return null;
  }

  static validateEmail(value: string, fieldName: string): string | null {
    if (!value || value.trim().length === 0) return null;
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  }

  static validateRichText(value: any, fieldName: string): string | null {
    if (!value || !value.children || value.children.length === 0) {
      return `${fieldName} is required`;
    }
    
    // Check if rich text has actual content
    const hasContent = value.children.some((child: any) => {
      if (child.type === 'p' && child.children) {
        return child.children.some((textNode: any) => 
          textNode.text && textNode.text.trim().length > 0
        );
      }
      return false;
    });
    
    if (!hasContent) {
      return `${fieldName} cannot be empty`;
    }
    
    return null;
  }

  static validateImage(value: string, fieldName: string): string | null {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    
    // Check if it's a valid image path or URL
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isUrl = value.startsWith('http') || value.startsWith('/');
    
    if (!isUrl && !imageExtensions.test(value)) {
      return `${fieldName} must be a valid image file`;
    }
    
    return null;
  }
}

// Error handling utilities
export class TinaErrorHandler {
  static handleError(error: any, context: string = 'TinaCMS operation'): TinaError {
    console.error(`${context}:`, error);
    
    let tinaError: TinaError;
    
    if (error?.message?.includes('Client ID')) {
      tinaError = {
        message: 'TinaCMS is not properly configured. Please check your environment variables.',
        code: 'CONFIG_ERROR',
        type: 'config'
      };
    } else if (error?.message?.includes('authentication') || error?.message?.includes('unauthorized')) {
      tinaError = {
        message: 'Authentication failed. Please sign in again.',
        code: 'AUTH_ERROR',
        type: 'auth'
      };
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      tinaError = {
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
        type: 'network'
      };
    } else if (error?.message?.includes('validation')) {
      tinaError = {
        message: error.message,
        code: 'VALIDATION_ERROR',
        type: 'validation',
        field: error.field
      };
    } else {
      tinaError = {
        message: error?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        type: 'unknown'
      };
    }
    
    return tinaError;
  }

  static showErrorToast(error: TinaError) {
    toast({
      title: "Content Management Error",
      description: error.message,
      variant: "destructive",
    });
  }

  static showSuccessToast(message: string) {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }
}

// Content backup and recovery utilities
export class TinaBackupManager {
  private static BACKUP_KEY = 'tina_content_backup';
  
  static saveBackup(content: any, contentType: string) {
    try {
      const backup = {
        content,
        contentType,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(`${this.BACKUP_KEY}_${contentType}`, JSON.stringify(backup));
    } catch (error) {
      console.warn('Failed to save content backup:', error);
    }
  }
  
  static getBackup(contentType: string): any | null {
    try {
      const backupStr = localStorage.getItem(`${this.BACKUP_KEY}_${contentType}`);
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        return backup.content;
      }
    } catch (error) {
      console.warn('Failed to retrieve content backup:', error);
    }
    return null;
  }
  
  static clearBackup(contentType: string) {
    try {
      localStorage.removeItem(`${this.BACKUP_KEY}_${contentType}`);
    } catch (error) {
      console.warn('Failed to clear content backup:', error);
    }
  }
}

// Content validation schemas
export const contentValidationSchemas = {
  homepage: {
    hero: {
      headline: (value: string) => TinaValidator.validateRequired(value, 'Headline') || 
                                   TinaValidator.validateMaxLength(value, 100, 'Headline'),
      subtitle: (value: any) => TinaValidator.validateRichText(value, 'Subtitle'),
      posterImage: (value: string) => TinaValidator.validateImage(value, 'Poster Image'),
      trailerButton: {
        text: (value: string) => TinaValidator.validateRequired(value, 'Button Text'),
        videoUrl: (value: string) => TinaValidator.validateUrl(value, 'Video URL')
      }
    },
    screeningsCta: {
      headline: (value: string) => TinaValidator.validateRequired(value, 'Headline'),
      description: (value: any) => TinaValidator.validateRichText(value, 'Description'),
      buttonText: (value: string) => TinaValidator.validateRequired(value, 'Button Text')
    },
    testimonials: {
      headline: (value: string) => TinaValidator.validateRequired(value, 'Section Headline'),
      items: (items: any[]) => {
        if (!items || items.length === 0) {
          return 'At least one testimonial is required';
        }
        return null;
      }
    }
  },
  faq: {
    headline: (value: string) => TinaValidator.validateRequired(value, 'FAQ Headline'),
    items: (items: any[]) => {
      if (!items || items.length === 0) {
        return 'At least one FAQ item is required';
      }
      return null;
    }
  }
};

// Utility function to validate entire content object
export function validateContent(content: any, schema: any, path: string = ''): string[] {
  const errors: string[] = [];
  
  for (const [key, validator] of Object.entries(schema)) {
    const currentPath = path ? `${path}.${key}` : key;
    const value = content?.[key];
    
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) {
        errors.push(`${currentPath}: ${error}`);
      }
    } else if (typeof validator === 'object' && validator !== null) {
      const nestedErrors = validateContent(value, validator, currentPath);
      errors.push(...nestedErrors);
    }
  }
  
  return errors;
}

// Auto-save functionality
export class TinaAutoSave {
  private static timers: Map<string, NodeJS.Timeout> = new Map();
  private static SAVE_DELAY = 2000; // 2 seconds
  
  static scheduleAutoSave(contentId: string, saveFunction: () => Promise<void>) {
    // Clear existing timer
    const existingTimer = this.timers.get(contentId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Schedule new save
    const timer = setTimeout(async () => {
      try {
        await saveFunction();
        TinaErrorHandler.showSuccessToast('Content saved automatically');
      } catch (error) {
        const tinaError = TinaErrorHandler.handleError(error, 'Auto-save');
        TinaErrorHandler.showErrorToast(tinaError);
      } finally {
        this.timers.delete(contentId);
      }
    }, this.SAVE_DELAY);
    
    this.timers.set(contentId, timer);
  }
  
  static cancelAutoSave(contentId: string) {
    const timer = this.timers.get(contentId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(contentId);
    }
  }
}