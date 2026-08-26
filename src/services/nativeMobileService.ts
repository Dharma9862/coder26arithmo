import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Service providing bridge functions for Android Native Runtime (Capacitor / Google Play Store).
 */
export class NativeMobileService {
  private static isInitialized = false;

  public static isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  public static getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * Initializes native Android status bar, splash screen, and hardware back button.
   */
  public static async initNativeFeatures(onBackAction?: () => boolean): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!this.isNativePlatform()) {
      return;
    }

    try {
      // 1. Android Status Bar styling (Match dark background)
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0F172A' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (err) {
      console.warn('Native status bar setup note:', err);
    }

    try {
      // 2. Android Hardware Back Button listener
      CapApp.addListener('backButton', ({ canGoBack }) => {
        // Allow UI to consume back button (e.g. close active modal or return to home)
        if (onBackAction) {
          const handled = onBackAction();
          if (handled) return;
        }

        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });
    } catch (err) {
      console.warn('Native back button setup note:', err);
    }
  }

  /**
   * Trigger native Android haptic engine
   */
  public static async triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): Promise<void> {
    if (!this.isNativePlatform()) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
      }
    } catch {
      // Fallback silently if device does not have haptics motor
    }
  }
}
