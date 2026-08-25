/**
 * AdService - Manages Google AdMob banner, interstitial, and rewarded ad units.
 * Free users see occasional non-intrusive ads; Premium users are 100% ad-free.
 */

export interface AdMobConfig {
  appIdAndroid: string;
  appIdIos: string;
  bannerUnitId: string;
  interstitialUnitId: string;
  rewardedUnitId: string;
}

export const TEST_ADMOB_IDS: AdMobConfig = {
  appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
  appIdIos: 'ca-app-pub-3940256099942544~1458784511',
  bannerUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialUnitId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedUnitId: 'ca-app-pub-3940256099942544/5224354917',
};

class AdService {
  private gamesSinceLastAd: number = 0;
  private readonly INTERSTITIAL_FREQUENCY: number = 2; // Show every 2-3 games

  public shouldShowInterstitial(isPremium: boolean): boolean {
    if (isPremium) return false;
    this.gamesSinceLastAd += 1;
    if (this.gamesSinceLastAd >= this.INTERSTITIAL_FREQUENCY) {
      this.gamesSinceLastAd = 0;
      return true;
    }
    return false;
  }

  public shouldShowBanner(isPremium: boolean, currentScreen: string): boolean {
    if (isPremium) return false;
    // Don't show banners during live gameplay
    if (currentScreen === 'live_game') return false;
    return true;
  }
}

export const adService = new AdService();
