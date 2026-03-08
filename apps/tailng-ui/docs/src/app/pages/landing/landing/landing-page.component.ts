import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TngCardComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';

type ContentCard = Readonly<{
  title: string;
  description: string;
  href?: string;
}>;

type RouteCard = Readonly<{
  title: string;
  description: string;
  route: string;
}>;

const packageCards: readonly ContentCard[] = [
  {
    title: 'CDK',
    description:
      'Low-level utilities for interaction, behavior, structure, focus management, overlays, and shared UI mechanics.',
    href: '/cdk',
  },
  {
    title: 'Primitives',
    description:
      'Headless accessible foundations for menus, popovers, dialogs, tabs, switches, drawers, and more.',
    href: '/primitives',
  },
  {
    title: 'Components',
    description:
      'Reusable UI components with sensible structure and minimal styling, ready for real product development.',
    href: '/components',
  },
  {
    title: 'Icons',
    description: 'A consistent icon set designed to fit naturally into TailNG apps and docs.',
    href: '/icons',
  },
  {
    title: 'Theme',
    description: 'Tokens, visual foundations, presets, and mode-aware styling for product interfaces.',
    href: '/theme',
  },
  {
    title: 'Install',
    description:
      'Selective adoption inspired by shadcn-like workflows, so teams can own exactly what they ship.',
  },
];

const principles: readonly ContentCard[] = [
  {
    title: 'Accessibility first',
    description:
      'Strong interaction patterns, semantics, keyboard support, and ARIA behavior are the baseline.',
  },
  {
    title: 'Ownable by teams',
    description:
      'UI code stays understandable, adaptable, and maintainable for product teams over time.',
  },
  {
    title: 'Layered architecture',
    description: 'Adopt CDK, primitives, components, icons, and themes at the level that fits your project.',
  },
  {
    title: 'Angular-native',
    description: 'Built for modern Angular patterns with a signal-first mindset and predictable APIs.',
  },
  {
    title: 'Styling flexibility',
    description: 'TailNG supports branding and custom design systems without forcing one rigid visual identity.',
  },
  {
    title: 'Practical by default',
    description: 'Designed for real dashboards, forms, overlays, tables, and product workflows.',
  },
];

const whyTailng: readonly ContentCard[] = [
  {
    title: 'Modular adoption',
    description:
      'Start with components, go lower with primitives, and build deeper with CDK only when needed.',
  },
  {
    title: 'Better ownership',
    description: 'The architecture encourages clarity so teams can understand and evolve the UI they ship.',
  },
  {
    title: 'Accessibility that matters',
    description: 'Focus behavior, keyboard interactions, and semantics are treated as core product quality.',
  },
  {
    title: 'Design-system friendly',
    description: 'TailNG fits branded ecosystems instead of forcing a fixed visual identity on every product.',
  },
  {
    title: 'Flexible install path',
    description: 'Choose package installation or selective ownership patterns based on how your team works.',
  },
];

const installOptions: readonly ContentCard[] = [
  {
    title: 'Use components',
    description: 'Start with ready-to-use building blocks for forms, overlays, navigation, and data UI.',
  },
  {
    title: 'Use primitives',
    description: 'Build your own presentation layer on top of accessible behavior contracts.',
  },
  {
    title: 'Use CDK',
    description: 'Compose advanced product patterns with lower-level behavior foundations.',
  },
  {
    title: 'Use selective install',
    description: 'Adopt only the modules your team wants to own and evolve.',
  },
];

const themeHighlights: readonly ContentCard[] = [
  {
    title: 'Theme tokens',
    description:
      'Define reusable values for color, spacing, typography, borders, and surfaces across the product.',
  },
  {
    title: 'Presets and customization',
    description: 'Start from a preset, then adapt TailNG to match your internal system language.',
  },
  {
    title: 'Dark and light support',
    description: 'Support modern UI expectations with clean mode-aware visual behavior.',
  },
  {
    title: 'Styling without lock-in',
    description: 'Works with vanilla CSS, utility workflows, and design-system conventions.',
  },
];

const exploreLinks: readonly RouteCard[] = [
  {
    title: 'Components',
    description: 'Browse ready-made UI building blocks for common product needs.',
    route: '/components',
  },
  {
    title: 'Primitives',
    description: 'Explore accessible headless interaction patterns for custom UI development.',
    route: '/primitives',
  },
  {
    title: 'CDK',
    description: 'See the low-level behavioral foundations that power the system.',
    route: '/cdk',
  },
  {
    title: 'Theme',
    description: 'Understand tokens, presets, and mode-aware styling foundations.',
    route: '/theme',
  },
  {
    title: 'Icons',
    description: 'Browse icon usage patterns for interface consistency.',
    route: '/icons',
  },
];

@Component({
  selector: 'app-landing-page',
  imports: [
    RouterLink,
    TngIcon,
    TngCardComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  protected readonly packageCards = packageCards;
  protected readonly principles = principles;
  protected readonly whyTailng = whyTailng;
  protected readonly installOptions = installOptions;
  protected readonly themeHighlights = themeHighlights;
  protected readonly exploreLinks = exploreLinks;
}
