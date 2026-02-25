import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class CreatorHomeScreen extends ConsumerWidget {
  const CreatorHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final displayName = auth.profile?.displayName ?? auth.user?.email ?? 'Criador';

    return Scaffold(
      appBar: AppBar(
        centerTitle: false,
        title: Text(
          'Fresta',
          style: theme.textTheme.headlineMedium?.copyWith(
            color: colorScheme.secondary,
            fontWeight: FontWeight.w900,
            letterSpacing: -1.0,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () => context.go('/account/profile'),
            icon: Icon(Icons.person_outline_rounded, color: colorScheme.onSurface),
            tooltip: 'Perfil',
          ),
          IconButton(
            onPressed: () async {
              await ref.read(authControllerProvider.notifier).signOut();
            },
            icon: Icon(Icons.logout_rounded, color: colorScheme.onSurface),
            tooltip: 'Sair',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 100),
          children: [
            // Premium Welcome Header with Muted Greeting
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Olá, ${displayName.split('@').first}',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Qual surpresa vamos preparar hoje?',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 0.6),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Main Featured Concept Card - Premium Gradient & Glassmorphism
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(
                    color: colorScheme.primary.withValues(alpha: 0.2),
                    blurRadius: 40,
                    offset: const Offset(0, 20),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            colorScheme.tertiary,
                            colorScheme.primary,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                    ),
                  ),
                  // Background Pattern/Glow
                  Positioned(
                    top: -60,
                    right: -60,
                    child: Container(
                      width: 240,
                      height: 240,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            colorScheme.secondary.withValues(alpha: 0.4),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                          decoration: BoxDecoration(
                            color: colorScheme.secondary,
                            borderRadius: BorderRadius.circular(999),
                            boxShadow: [
                              BoxShadow(
                                color: colorScheme.secondary.withValues(alpha: 0.3),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Text(
                            'NOVO TEMA',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 10,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Aniversário\nInesquecível',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                            height: 1.1,
                            letterSpacing: -1.0,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Um tema vibrante para celebrar mais um ano de vida com surpresas diárias.',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.8),
                            height: 1.5,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 32),
                        FilledButton(
                          onPressed: () => context.go('/creator/calendars/new'),
                          style: FilledButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: colorScheme.tertiary,
                            minimumSize: const Size(160, 54),
                            elevation: 8,
                            shadowColor: Colors.black.withValues(alpha: 0.2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('Começar agora', style: TextStyle(fontWeight: FontWeight.w800)),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_forward_rounded, size: 18),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),

            // Theme Discovery Section Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Explore Temas',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 20,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/creator/home/themes'),
                  style: TextButton.styleFrom(
                    foregroundColor: colorScheme.primary,
                  ),
                  child: const Text('Ver todos', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            SizedBox(
              height: 220,
              child: ListView(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                children: [
                  _ThemePreviewCard(
                    title: 'Namoro\nInesquecível',
                    category: 'Romance',
                    isPremium: false,
                    gradientColors: [colorScheme.primaryContainer, colorScheme.primaryContainer.withValues(alpha: 0.5)],
                    imageAsset: 'assets/images/themes/mascot-namoro.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 20),
                  _ThemePreviewCard(
                    title: 'Casamento\nPerfeito',
                    category: 'Amor',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFFF3E0), Color(0xFFFFE0B2)],
                    imageAsset: 'assets/images/themes/casamento.png',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 20),
                  _ThemePreviewCard(
                    title: 'Feliz\nAniversário',
                    category: 'Celebração',
                    isPremium: false,
                    gradientColors: const [Color(0xFFE0E7FF), Color(0xFFC7D2FE)],
                    imageAsset: 'assets/images/themes/mascot-aniversario.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                  const SizedBox(width: 20),
                  _ThemePreviewCard(
                    title: 'Nossas\nBodas',
                    category: 'Romance',
                    isPremium: true,
                    gradientColors: const [Color(0xFFFCE7F3), Color(0xFFFBCFE8)],
                    imageAsset: 'assets/images/themes/mascot-bodas.jpg',
                    onTap: () => context.go('/creator/calendars/new'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ThemePreviewCard extends StatelessWidget {
  final String title;
  final String category;
  final bool isPremium;
  final List<Color> gradientColors;
  final String imageAsset;
  final VoidCallback onTap;

  const _ThemePreviewCard({
    required this.title,
    required this.category,
    required this.isPremium,
    required this.gradientColors,
    required this.imageAsset,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      width: 170,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: colorScheme.surface,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                flex: 4,
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Image.asset(
                        imageAsset,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.transparent, Colors.black.withValues(alpha: 0.2)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                    if (isPremium)
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: colorScheme.secondary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: colorScheme.secondary.withValues(alpha: 0.3),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Icon(Icons.star_rounded, color: Colors.white, size: 14),
                        ),
                      ),
                  ],
                ),
              ),
              Expanded(
                flex: 3,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        category.toUpperCase(),
                        style: TextStyle(
                          color: colorScheme.primary,
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          height: 1.2,
                          letterSpacing: -0.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

