import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../app/theme/theme_manager.dart';
import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';

/// Início — Personal dashboard: greeting, recent calendars, tips
class CreatorHomeScreen extends ConsumerWidget {
  const CreatorHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final asyncCalendars = ref.watch(myCalendarsProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final displayName = auth.profile?.displayName ?? auth.user?.email?.split('@').first ?? 'Criador';

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
          children: [
            // ── Header ──
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'fresta',
                        style: TextStyle(
                          fontFamily: 'Fredoka',
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -1.5,
                          color: colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Olá, $displayName 👋',
                        style: TextStyle(
                          fontSize: 15,
                          color: colorScheme.onSurface.withValues(alpha: 0.6),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                _AvatarButton(auth: auth, onTap: () => context.go('/account/profile')),
              ],
            ),
            const SizedBox(height: 28),

            // ── Quick Tip Card ──
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [colorScheme.primary, colorScheme.tertiary],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: colorScheme.primary.withValues(alpha: 0.15), blurRadius: 20, offset: const Offset(0, 8))],
              ),
              child: Row(
                children: [
                  Container(
                    width: 52, height: 52,
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(16)),
                    child: const Icon(LucideIcons.lightbulb, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Dica rápida', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
                        const SizedBox(height: 4),
                        Text(
                          'Adicione uma mensagem de carinho em cada dia do calendário para tornar a surpresa inesquecível!',
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 13, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // ── Recent Calendars ──
            asyncCalendars.when(
              loading: () => const SizedBox(),
              error: (_, __) => const SizedBox(),
              data: (items) {
                if (items.isEmpty) return _EmptyDashboard(onCreateTap: () => context.go('/creator/calendars/new'));
                final recent = items.take(3).toList();

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Recentes', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                        TextButton(
                          onPressed: () {
                            // Navigate to Calendários tab (index 1 in the shell)
                            final shell = StatefulNavigationShell.maybeOf(context);
                            if (shell != null) {
                              shell.goBranch(1);
                            }
                          },
                          child: Text('Ver todos', style: TextStyle(color: colorScheme.primary, fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...recent.map((cal) {
                      final themeConfig = ThemeManager.getTheme(cal.themeId);
                      final mascot = ThemeManager.getMascotAssetPath(cal.themeId);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Container(
                          decoration: BoxDecoration(
                            color: colorScheme.surface,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(20),
                              onTap: () => context.go('/creator/calendars/${cal.id}'),
                              child: Padding(
                                padding: const EdgeInsets.all(14),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 52, height: 52,
                                      decoration: BoxDecoration(
                                        color: themeConfig.primaryColor.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      clipBehavior: Clip.antiAlias,
                                      child: mascot != null
                                          ? Image.asset(mascot, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Icon(themeConfig.defaultIcon, color: themeConfig.primaryColor, size: 22))
                                          : Icon(themeConfig.defaultIcon, color: themeConfig.primaryColor, size: 22),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(cal.title, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: colorScheme.onSurface), maxLines: 1, overflow: TextOverflow.ellipsis),
                                          const SizedBox(height: 3),
                                          Text('${cal.duration} dias • ${_statusLabel(cal.status)}', style: TextStyle(fontSize: 12, color: colorScheme.onSurface.withValues(alpha: 0.5), fontWeight: FontWeight.w500)),
                                        ],
                                      ),
                                    ),
                                    Icon(LucideIcons.chevronRight, size: 18, color: colorScheme.onSurface.withValues(alpha: 0.2)),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ],
                );
              },
            ),
            const SizedBox(height: 32),

            // ── Quick Actions ──
            Text('Ações rápidas', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -0.5)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _QuickActionCard(
                  icon: LucideIcons.plus, label: 'Criar novo', color: colorScheme.primary,
                  onTap: () => context.go('/creator/calendars/new'),
                )),
                const SizedBox(width: 12),
                Expanded(child: _QuickActionCard(
                  icon: LucideIcons.compass, label: 'Explorar temas', color: colorScheme.secondary,
                  onTap: () {
                    final shell = StatefulNavigationShell.maybeOf(context);
                    if (shell != null) shell.goBranch(2); // Explorar tab
                  },
                )),
              ],
            ),
          ],
        ),
      ),
    );
  }

  static String _statusLabel(String status) {
    return switch (status) {
      'ativo' || 'active' => 'Ativo',
      'rascunho' => 'Rascunho',
      'inativo' => 'Inativo',
      'finalizado' => 'Finalizado',
      _ => status,
    };
  }
}

// ── Avatar Button ──
class _AvatarButton extends StatelessWidget {
  const _AvatarButton({required this.auth, required this.onTap});
  final dynamic auth;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final profile = auth.profile;
    final user = auth.user;
    final avatarUrl = profile?.avatar;
    final isUrl = avatarUrl != null && avatarUrl.toString().startsWith('http');
    final initial = (profile?.displayName ?? user?.email ?? 'U').toString().characters.first.toUpperCase();

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44, height: 44,
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
          shape: BoxShape.circle,
          border: Border.all(color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.2), width: 2),
        ),
        clipBehavior: Clip.antiAlias,
        child: isUrl
            ? Image.network(
                avatarUrl.toString(),
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Center(child: Text(initial, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Theme.of(context).colorScheme.primary))),
              )
            : Center(child: Text(initial, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Theme.of(context).colorScheme.primary))),
      ),
    );
  }
}

// ── Empty Dashboard ──
class _EmptyDashboard extends StatelessWidget {
  const _EmptyDashboard({required this.onCreateTap});
  final VoidCallback onCreateTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 16, offset: const Offset(0, 8))],
      ),
      child: Column(
        children: [
          Container(
            width: 72, height: 72,
            decoration: BoxDecoration(color: const Color(0xFF2D7A5F).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
            child: const Icon(LucideIcons.gift, size: 32, color: Color(0xFF2D7A5F)),
          ),
          const SizedBox(height: 20),
          const Text('Crie sua primeira surpresa', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
          const SizedBox(height: 6),
          Text('Escolha um tema, personalize cada dia e encante quem receber.',
              textAlign: TextAlign.center, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 14, height: 1.5)),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: onCreateTap,
            icon: const Icon(Icons.add_rounded),
            label: const Text('Criar calendário', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }
}

// ── Quick Action Card ──
class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({required this.icon, required this.label, required this.color, required this.onTap});
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.12)),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(height: 14),
                Text(label, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Theme.of(context).colorScheme.onSurface)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
