// TypeScript interfaces and types for Table of Contents component
interface HeadingData {
  id: string;
  text: string;
  level: number;
  element: HTMLHeadingElement;
}

interface NumberingState {
  level1: number; // h1, h2, h3
  level2: number; // h4, h5, h6
}

interface TableOfContentsElement extends HTMLElement {
  headings: HeadingData[];
  isOpen: boolean;
  numbering: NumberingState;
  scrollOffset: number;
}

class TableOfContentsElement extends HTMLElement {
  public headings: HeadingData[] = [];
  public isOpen: boolean = false;
  public scrollOffset: number = 80; // Default offset for sticky headers
  public numbering: NumberingState = {
    level1: 0, // h1, h2, h3
    level2: 0  // h4, h5, h6
  };

  constructor() {
    super();
  }

  connectedCallback(): void {
    // Wait for content to be loaded
    setTimeout(() => {
      this.init();
    }, 100);
  }

  private init(): void {
    const contentEl = this.querySelector('[data-toc-content]') as HTMLElement;
    const navEl = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggleBtnEl = this.querySelector('[data-toc-toggle]') as HTMLElement;
    if (!contentEl || !navEl) return;

    // Get custom scroll offset from data attribute
    const customOffset = this.getAttribute('data-scroll-offset');
    if (customOffset) {
      this.scrollOffset = parseInt(customOffset, 10) || 80;
    }

    this.extractHeadings(contentEl);
    this.generateTOC(navEl);
    this.setupScrollSpy();
    this.setupSmoothScrolling(navEl);
    this.setupMobileToggle(toggleBtnEl);
  }

  private extractHeadings(contentEl: HTMLElement): void {
    const headingSelectors = 'h1, h2, h3, h4, h5, h6';
    const headingElements = contentEl.querySelectorAll(
      headingSelectors,
    ) as NodeListOf<HTMLHeadingElement>;

    this.headings = Array.from(headingElements).map((heading: HTMLHeadingElement): HeadingData => {
      const id = this.generateId(heading.textContent || '');
      heading.id = id;

      // Map h1,h2,h3 to level 1, h4,h5,h6 to level 2
      const originalLevel = parseInt(heading.tagName.charAt(1), 10);
      const mappedLevel = originalLevel <= 3 ? 1 : 2;

      return {
        id,
        text: heading.textContent?.trim() || '',
        level: mappedLevel,
        element: heading,
      };
    });
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateNumber(level: number): string {
    // Reset counters for levels below current level
    if (level === 1) {
      this.numbering.level2 = 0; // Reset level 2 when we encounter level 1
    }

    // Increment current level counter
    if (level === 1) {
      this.numbering.level1++;
    } else if (level === 2) {
      this.numbering.level2++;
    }

    // Generate hierarchical number
    let number = '';
    if (this.numbering.level1 > 0) {
      number += this.numbering.level1;
    }
    if (level === 2 && this.numbering.level2 > 0) {
      if (number) number += '.';
      number += this.numbering.level2;
    }

    return number;
  }

  private generateTOC(navEl: HTMLElement): void {
    const ul = document.createElement('ul');
    let currentLevel1: HeadingData | null = null;
    let currentLevel1List: HTMLUListElement | null = null;

    this.headings.forEach((heading: HeadingData) => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = `#${heading.id}`;

      // Generate number for this heading
      const number = this.generateNumber(heading.level);
      a.textContent = `${number}. ${heading.text}`;
      a.className = `level-${heading.level} ${heading.level > 1 ? 'pl-3' : ''}`;
      a.classList.add('body-core', 'text-secondary', 'hover:text-primary');

      li.appendChild(a);

      if (heading.level === 1) {
        // Level 1 headings (h1, h2, h3) are top-level parents
        currentLevel1 = heading;
        currentLevel1List = ul;
        currentLevel1List.appendChild(li);
      } else {
        // Level 2 headings (h4, h5, h6) are children of the current level 1
        if (currentLevel1List && currentLevel1) {
          // Check if we need to create a nested list for the current level 1
          let nestedUl = currentLevel1List.querySelector(
            `li:has(a[href="#${currentLevel1.id}"]) ul`,
          ) as HTMLUListElement;
          if (!nestedUl) {
            // Create nested ul for the current level 1
            const level1Li = currentLevel1List.querySelector(
              `li:has(a[href="#${currentLevel1.id}"])`,
            ) as HTMLLIElement;
            if (level1Li) {
              nestedUl = document.createElement('ul');
              level1Li.appendChild(nestedUl);
            }
          }

          if (nestedUl) {
            nestedUl.appendChild(li);
          } else {
            // Fallback: add to main list if something went wrong
            currentLevel1List.appendChild(li);
          }
        } else {
          // Fallback: add to main list if no level 1 found yet
          currentLevel1List = ul;
          currentLevel1List.appendChild(li);
        }
      }
    });

    navEl.appendChild(ul);
  }

  private setupScrollSpy(): void {
    let ticking = false;

    const updateActiveSection = (): void => {
      const scrollTop = document.documentElement.scrollTop;

      let activeHeading: HeadingData | null = null;

      // Find the heading that's closest to the top of the viewport
      for (let i = this.headings.length - 1; i >= 0; i--) {
        const heading = this.headings[i];
        const headingTop = heading.element.offsetTop;

        // Check if heading is at or near the top of the viewport
        // Use configurable offset to account for sticky headers or padding
        if (headingTop <= scrollTop + this.scrollOffset) {
          activeHeading = heading;
          break;
        }
      }

      // If no heading is found (scrolled past all content), use the last heading
      if (!activeHeading && this.headings.length > 0) {
        activeHeading = this.headings[this.headings.length - 1];
      }

      if (activeHeading) {
        this.setActiveItem(activeHeading.id);
      }

      ticking = false;
    };

    const requestTick = (): void => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });

    // Initial check
    updateActiveSection();
  }

  private setActiveItem(id: string): void {
    const navEl = this.querySelector('[data-toc-nav]') as HTMLElement;
    if (!navEl) return;

    // Remove active class from all links
    const links = navEl.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    links.forEach((link: HTMLAnchorElement) => {
      link.classList.replace('text-primary', 'text-secondary');
    });

    // Add active class to current link
    const activeLink = navEl.querySelector(`a[href="#${id}"]`) as HTMLAnchorElement;
    if (activeLink) {
      activeLink.classList.replace('text-secondary', 'text-primary');
    }
  }

  private setupSmoothScrolling(navEl: HTMLElement): void {
    navEl.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);

        if (targetId) {
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Calculate the target position with offset for sticky header
            const targetPosition = targetElement.offsetTop - this.scrollOffset;
            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth',
            });

            // Close mobile nav after clicking a link
            if (window.innerWidth <= 768) {
              this.closeMobileNav();
            }
          }
        }
      }
    });
  }

  private setupMobileToggle(toggleBtnEl: HTMLElement | null): void {
    if (!toggleBtnEl) return;

    toggleBtnEl.addEventListener('click', () => {
      this.toggleMobileNav();
    });
  }

  private toggleMobileNav(): void {
    const navEl = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggleBtnEl = this.querySelector('[data-toc-toggle]') as HTMLElement;

    if (!navEl || !toggleBtnEl) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      navEl.dataset.expanded = 'true';
      toggleBtnEl.dataset.expanded = 'true';
    } else {
      navEl.removeAttribute('data-expanded');
      toggleBtnEl.removeAttribute('data-expanded');
    }
  }

  private closeMobileNav(): void {
    const navEl = this.querySelector('[data-toc-nav]') as HTMLElement;
    const toggleBtnEl = this.querySelector('[data-toc-toggle]') as HTMLElement;

    if (!navEl || !toggleBtnEl) return;

    this.isOpen = false;
    navEl.removeAttribute('data-expanded');
    toggleBtnEl.removeAttribute('data-expanded');
  }
}

// Register the custom element
if (!customElements.get('table-of-contents')) {
  customElements.define('table-of-contents', TableOfContentsElement);
}

export default TableOfContentsElement;
