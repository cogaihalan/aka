export interface BannerSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
}

export interface FullWidthBannerProps {
    slides?: BannerSlide[];
    className?: string;
}
