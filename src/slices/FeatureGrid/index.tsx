import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

export type FeatureGridProps = SliceComponentProps<any>;

const FeatureGrid: FC<FeatureGridProps> = ({ slice }) => {
  const features = slice.items || [];
  const columns = slice.primary.columns || 3;
  const layout = slice.primary.layout || "grid";
  const showIcons = slice.primary.showIcons !== false;
  const showImages = slice.primary.showImages !== false;
  const alignment = slice.primary.alignment || "center";

  const getGridColumns = () => {
    switch (columns) {
      case 1: return "1fr";
      case 2: return "repeat(2, 1fr)";
      case 3: return "repeat(3, 1fr)";
      case 4: return "repeat(4, 1fr)";
      default: return "repeat(3, 1fr)";
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "left": return "es-feature-grid__content--left";
      case "right": return "es-feature-grid__content--right";
      default: return "es-feature-grid__content--center";
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="es-bounded es-feature-grid"
    >
      <div className="es-bounded__content es-feature-grid__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className={`es-feature-grid__header es-feature-grid__header--${alignment}`}>
            {isFilled.richText(slice.primary.title) && (
              <div className="es-feature-grid__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-feature-grid__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div 
            className={`es-feature-grid__grid es-feature-grid__grid--${layout}`}
            style={{ gridTemplateColumns: getGridColumns() }}
          >
            {features.map((feature: any, index: number) => (
              <div key={index} className={`es-feature-grid__feature ${getAlignmentClass()}`}>
                {/* Feature Image */}
                {showImages && isFilled.image(feature.image) && (
                  <div className="es-feature-grid__feature-image">
                    <PrismicNextLink field={feature.link}>
                      <PrismicNextImage
                        field={feature.image}
                        className="es-feature-grid__image"
                      />
                    </PrismicNextLink>
                  </div>
                )}

                {/* Feature Icon */}
                {showIcons && isFilled.image(feature.icon) && (
                  <div className="es-feature-grid__feature-icon">
                    <PrismicNextImage
                      field={feature.icon}
                      className="es-feature-grid__icon"
                    />
                  </div>
                )}

                {/* Feature Content */}
                <div className="es-feature-grid__feature-content">
                  {/* Title */}
                  {isFilled.keyText(feature.title) && (
                    <h3 className="es-feature-grid__feature-title">
                      <PrismicNextLink field={feature.link}>
                        {feature.title}
                      </PrismicNextLink>
                    </h3>
                  )}

                  {/* Description */}
                  {isFilled.richText(feature.description) && (
                    <div className="es-feature-grid__feature-description">
                      <PrismicRichText field={feature.description} />
                    </div>
                  )}

                  {/* Features List */}
                  {feature.features && feature.features.length > 0 && (
                    <ul className="es-feature-grid__feature-list">
                      {feature.features.map((item: any, itemIndex: number) => (
                        <li key={itemIndex} className="es-feature-grid__feature-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="es-feature-grid__check-icon">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Button */}
                  {isFilled.link(feature.link) && (
                    <div className="es-feature-grid__feature-button-container">
                      <PrismicNextLink
                        field={feature.link}
                        className="es-feature-grid__feature-button"
                      >
                        {feature.buttonText || "Learn More"}
                      </PrismicNextLink>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {isFilled.link(slice.primary.footerLink) && (
          <div className={`es-feature-grid__footer es-feature-grid__footer--${alignment}`}>
            <PrismicNextLink
              field={slice.primary.footerLink}
              className="es-feature-grid__footer-button"
            >
              {slice.primary.footerButtonText || "View All Features"}
            </PrismicNextLink>
          </div>
        )}
      </div>

      <style>
        {`
          .es-bounded {
            padding: 8vw 2rem;
          }

          .es-bounded__content {
            margin-left: auto;
            margin-right: auto;
            max-width: 90%;
          }

          @media screen and (min-width: 640px) {
            .es-bounded__content {
              max-width: 85%;
            }
          }

          @media screen and (min-width: 896px) {
            .es-bounded__content {
              max-width: 80%;
            }
          }

          @media screen and (min-width: 1280px) {
            .es-bounded__content {
              max-width: 75%;
            }
          }

          .es-feature-grid {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-feature-grid__header {
            margin-bottom: 3rem;
          }

          .es-feature-grid__header--left {
            text-align: left;
          }

          .es-feature-grid__header--center {
            text-align: center;
          }

          .es-feature-grid__header--right {
            text-align: right;
          }

          .es-feature-grid__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-feature-grid__title * {
            margin: 0;
          }

          .es-feature-grid__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-feature-grid__subtitle * {
            margin: 0;
          }

          .es-feature-grid__header--left .es-feature-grid__subtitle,
          .es-feature-grid__header--right .es-feature-grid__subtitle {
            margin: 0;
          }

          .es-feature-grid__grid {
            display: grid;
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .es-feature-grid__feature {
            background: #fff;
            border-radius: 0.75rem;
            padding: 2rem;
            transition: all 0.3s ease;
            border: 1px solid #e5e7eb;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .es-feature-grid__feature:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
            border-color: #16745f;
          }

          .es-feature-grid__feature-image {
            margin-bottom: 1.5rem;
            border-radius: 0.5rem;
            overflow: hidden;
            aspect-ratio: 16/9;
          }

          .es-feature-grid__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .es-feature-grid__feature:hover .es-feature-grid__image {
            transform: scale(1.05);
          }

          .es-feature-grid__feature-icon {
            width: 64px;
            height: 64px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #16745f, #0d5e4c);
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-feature-grid__icon {
            width: 32px;
            height: 32px;
            filter: brightness(0) invert(1);
          }

          .es-feature-grid__feature-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .es-feature-grid__content--left {
            text-align: left;
          }

          .es-feature-grid__content--center {
            text-align: center;
          }

          .es-feature-grid__content--right {
            text-align: right;
          }

          .es-feature-grid__feature-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            line-height: 1.4;
          }

          .es-feature-grid__feature-title a {
            color: #1a1a1a;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .es-feature-grid__feature-title a:hover {
            color: #16745f;
          }

          .es-feature-grid__feature-description {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            flex: 1;
          }

          .es-feature-grid__feature-description * {
            margin: 0;
          }

          .es-feature-grid__feature-list {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
          }

          .es-feature-grid__feature-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            color: #4b5563;
          }

          .es-feature-grid__check-icon {
            color: #16745f;
            flex-shrink: 0;
          }

          .es-feature-grid__feature-button-container {
            margin-top: auto;
          }

          .es-feature-grid__feature-button {
            display: inline-block;
            background-color: #16745f;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s ease;
            text-align: center;
            width: 100%;
          }

          .es-feature-grid__feature-button:hover {
            background-color: #0d5e4c;
          }

          .es-feature-grid__footer {
            margin-top: 2rem;
          }

          .es-feature-grid__footer--left {
            text-align: left;
          }

          .es-feature-grid__footer--center {
            text-align: center;
          }

          .es-feature-grid__footer--right {
            text-align: right;
          }

          .es-feature-grid__footer-button {
            display: inline-block;
            background-color: transparent;
            color: #16745f;
            padding: 0.75rem 2rem;
            border: 2px solid #16745f;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .es-feature-grid__footer-button:hover {
            background-color: #16745f;
            color: #fff;
          }

          @media (max-width: 768px) {
            .es-feature-grid__grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .es-feature-grid__grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (min-width: 1025px) and (max-width: 1200px) {
            .es-feature-grid__grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default FeatureGrid;
