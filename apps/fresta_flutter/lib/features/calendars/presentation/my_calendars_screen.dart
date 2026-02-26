import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../app/theme/theme_manager.dart';
import '../../../data/repositories/calendars_repository.dart';
import '../../../shared/models/calendar_models.dart';
import '../application/calendar_providers.dart';

class MyCalendarsScreen extends ConsumerStatefulWidget {
  const MyCalendarsScreen({super.key});

  @override
  ConsumerState<MyCalendarsScreen> createState() => _MyCalendarsScreenState();
}

class _MyCalendarsScreenState extends ConsumerState<MyCalendarsScreen> {
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final asyncCalendars = ref.watch(myCalendarsProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: asyncCalendars.when(
          loading: () => Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
            ),
          ),
          error: (error, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.error_outline_rounded, size: 48, color: colorScheme.error),
                  const SizedBox(height: 16),
                  Text('Ops! Algo deu errado.', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800, color: colorScheme.error)),
                  const SizedBox(height: 8),
                  Text(error.toString(), textAlign: TextAlign.center, style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6))),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () => ref.invalidate(myCalendarsProvider),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Tentar novamente'),
                  ),
                ],
              ),
            ),
          ),
          data: (items) {
            final filtered = _searchQuery.isEmpty
                ? items
                : items.where((c) => c.title.toLowerCase().contains(_searchQuery.toLowerCase())).toList();

            return RefreshIndicator(
              onRefresh: () async => ref.refresh(myCalendarsProvider.future),
              color: colorScheme.primary,
              child: CustomScrollView(
                slivers: [
                  // ── Stats Header ────────────────────────────────
                  SliverToBoxAdapter(child: _StatsHeader(calendars: items)),

                  // ── Search Bar ──────────────────────────────────
                  SliverPersistentHeader(
                    floating: true,
                    delegate: _SearchBarDelegate(
                      query: _searchQuery,
                      onChanged: (q) => setState(() => _searchQuery = q),
                    ),
                  ),

                  // ── Calendar List or Empty State ────────────────
                  if (filtered.isEmpty)
                    SliverFillRemaining(
                      hasScrollBody: false,
                      child: _EmptyState(hasSearch: _searchQuery.isNotEmpty),
                    )
                  else
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 100),
                      sliver: SliverList.separated(
                        itemCount: filtered.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (ctx, index) {
                          final item = filtered[index];
                          return _CalendarCard(
                            calendar: item,
                            onTap: () => context.go('/creator/calendars/${item.id}'),
                            onShare: () => SharePlus.instance.share(
                              ShareParams(
                                text: '🎉 Tenho uma surpresa para você! Abra minha Fresta:\n\nhttps://fresta.app/c/${item.id}',
                                subject: 'Minha surpresa no Fresta',
                              ),
                            ),
                            onDelete: () => _confirmDelete(context, ref, item),
                          );
                        },
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ),
      // No FAB needed — navbar already has + button
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref, CalendarSummary calendar) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.delete_forever_rounded, color: Color(0xFFDC2626), size: 24),
          ),
          const SizedBox(width: 16),
          const Text('Excluir Calendário?', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
        ]),
        content: RichText(
          text: TextSpan(
            style: TextStyle(color: Theme.of(ctx).colorScheme.onSurface.withValues(alpha: 0.7), height: 1.5, fontSize: 15),
            children: [
              const TextSpan(text: 'Você está prestes a excluir permanentemente '),
              TextSpan(text: '"${calendar.title}"', style: const TextStyle(fontWeight: FontWeight.w800)),
              const TextSpan(text: '. Todos os momentos e surpresas serão perdidos.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(backgroundColor: const Color(0xFFDC2626)),
            child: const Text('Excluir', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      try {
        await ref.read(calendarsRepositoryProvider).deleteCalendar(calendar.id);
        ref.invalidate(myCalendarsProvider);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Calendário "${calendar.title}" excluído.'),
            backgroundColor: const Color(0xFF2D7A5F),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao excluir: $e'), backgroundColor: const Color(0xFFDC2626)),
        );
      }
    }
  }
}

// ── Stats Header ─────────────────────────────────────────

class _StatsHeader extends StatelessWidget {
  const _StatsHeader({required this.calendars});
  final List<CalendarSummary> calendars;

  @override
  Widget build(BuildContext context) {
    final active = calendars.where((c) => c.status == 'ativo').length;
    final views = calendars.fold<int>(0, (sum, c) => sum + c.views);
    final total = calendars.length;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Meus Calendários',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              letterSpacing: -1,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Gerencie suas experiências e acompanhe os momentos',
            style: TextStyle(
              fontSize: 14,
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _StatChip(label: 'Ativos', value: '$active', icon: LucideIcons.calendar, color: const Color(0xFFF9A03F)),
              const SizedBox(width: 10),
              _StatChip(label: 'Views', value: views > 999 ? '${(views / 1000).toStringAsFixed(1)}k' : '$views', icon: LucideIcons.eye, color: const Color(0xFF4ECDC4)),
              const SizedBox(width: 10),
              _StatChip(label: 'Total', value: '$total', icon: LucideIcons.gift, color: const Color(0xFF2D7A5F)),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.15)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Theme.of(context).colorScheme.onSurface, letterSpacing: -0.5)),
            Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: color, letterSpacing: 1)),
          ],
        ),
      ),
    );
  }
}

// ── Search Bar Delegate ──────────────────────────────────────

class _SearchBarDelegate extends SliverPersistentHeaderDelegate {
  const _SearchBarDelegate({required this.query, required this.onChanged});
  final String query;
  final ValueChanged<String> onChanged;

  @override
  double get minExtent => 72;
  @override
  double get maxExtent => 72;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.08)),
        ),
        child: Row(
          children: [
            Icon(LucideIcons.search, size: 18, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4)),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                onChanged: onChanged,
                style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  hintText: 'Buscar por título...',
                  hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3), fontWeight: FontWeight.w500),
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  bool shouldRebuild(covariant _SearchBarDelegate oldDelegate) => query != oldDelegate.query;
}

// ── Empty State ──────────────────────────────────────────

class _EmptyState extends StatelessWidget {
  const _EmptyState({this.hasSearch = false});
  final bool hasSearch;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(color: const Color(0xFF2D7A5F).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(24)),
              child: const Icon(LucideIcons.sparkles, size: 36, color: Color(0xFF2D7A5F)),
            ),
            const SizedBox(height: 24),
            Text(
              hasSearch ? 'Nenhum resultado' : 'Sua jornada começa aqui',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: Theme.of(context).colorScheme.onSurface),
            ),
            const SizedBox(height: 8),
            Text(
              hasSearch ? 'Tente outro termo de busca.' : 'Crie um calendário e emocione quem o receber.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 15, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Calendar Card ────────────────────────────────────────

class _CalendarCard extends StatelessWidget {
  const _CalendarCard({required this.calendar, required this.onTap, required this.onShare, required this.onDelete});

  final CalendarSummary calendar;
  final VoidCallback onTap;
  final VoidCallback onShare;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final imageAsset = ThemeManager.getMascotAssetPath(calendar.themeId) ?? 'assets/images/themes/mascot-aniversario.jpg';
    final themeConfig = ThemeManager.getTheme(calendar.themeId);

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, 4))],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // ── Mascot Image ──
                Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(
                    color: themeConfig.primaryColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Image.asset(
                    imageAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Icon(themeConfig.defaultIcon, color: themeConfig.primaryColor, size: 24),
                  ),
                ),
                const SizedBox(width: 14),

                // ── Title + Meta + Badges ──
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        calendar.title,
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: colorScheme.onSurface, letterSpacing: -0.3),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${_themeName(calendar.themeId)} • ${calendar.duration} dias',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          _PlanBadge(isPremium: calendar.isPremium),
                          const SizedBox(width: 6),
                          _StatusBadge(status: calendar.status),
                          if (calendar.views > 0) ...[
                            const SizedBox(width: 6),
                            _ViewsBadge(count: calendar.views),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 4),

                // ── Dropdown Menu ──
                PopupMenuButton<String>(
                  onSelected: (value) {
                    switch (value) {
                      case 'view':
                        onTap();
                        break;
                      case 'share':
                        onShare();
                        break;
                      case 'delete':
                        onDelete();
                        break;
                    }
                  },
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  icon: Icon(Icons.more_vert_rounded, color: colorScheme.onSurface.withValues(alpha: 0.4)),
                  itemBuilder: (_) => [
                    PopupMenuItem(value: 'view', child: Row(children: [
                      Icon(LucideIcons.eye, size: 18, color: colorScheme.primary), const SizedBox(width: 12),
                      const Text('Visualizar', style: TextStyle(fontWeight: FontWeight.w700)),
                    ])),
                    PopupMenuItem(value: 'share', child: Row(children: [
                      Icon(LucideIcons.share2, size: 18, color: colorScheme.primary), const SizedBox(width: 12),
                      const Text('Compartilhar', style: TextStyle(fontWeight: FontWeight.w700)),
                    ])),
                    const PopupMenuDivider(),
                    PopupMenuItem(value: 'delete', child: Row(children: [
                      const Icon(LucideIcons.trash2, size: 18, color: Color(0xFFDC2626)), const SizedBox(width: 12),
                      const Text('Excluir', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFFDC2626))),
                    ])),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  static String _themeName(String id) {
    const m = {
      'namoro': 'Amor & Romance',
      'casamento': 'Nossa União',
      'bodas': 'Bodas',
      'noivado': 'Eternamente Juntos',
      'aniversario': 'Aniversário',
      'natal': 'Natal',
      'viagem': 'Viagem',
      'carnaval': 'Carnaval',
      'saojoao': 'São João',
      'reveillon': 'Réveillon',
      'pascoa': 'Páscoa',
      'diadasmaes': 'Dia das Mães',
      'diadospais': 'Dia dos Pais',
      'diadascriancas': 'Dia das Crianças',
      'independencia': 'Independência',
      'estudo': 'Estudos',
      'estudos': 'Estudos',
      'metas': 'Metas',
    };
    return m[id] ?? 'Custom';
  }
}

// ── Premium / Free Badge ─────────────────────────────

class _PlanBadge extends StatelessWidget {
  const _PlanBadge({required this.isPremium});
  final bool isPremium;

  @override
  Widget build(BuildContext context) {
    if (isPremium) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFFBBF24)]),
          borderRadius: BorderRadius.circular(99),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          const Icon(LucideIcons.crown, size: 10, color: Color(0xFF78350F)),
          const SizedBox(width: 4),
          Text('PLUS', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF78350F), letterSpacing: 1)),
        ]),
      );
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text('GRÁTIS', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4), letterSpacing: 1)),
    );
  }
}

// ── Status Badge ─────────────────────────────────────

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});
  final String status;

  @override
  Widget build(BuildContext context) {
    final (Color color, String label, IconData? icon) = switch (status) {
      'ativo' || 'active' => (const Color(0xFF2D7A5F), 'Ativo', null),
      'rascunho' => (const Color(0xFFF59E0B), 'Rascunho', LucideIcons.pencil),
      'inativo' => (const Color(0xFF6B7280), 'Inativo', LucideIcons.clock),
      'finalizado' => (const Color(0xFF3B82F6), 'Finalizado', LucideIcons.circleCheck),
      'aguardando_pagamento' => (const Color(0xFFF59E0B), 'Pgto pendente', LucideIcons.creditCard),
      _ => (const Color(0xFF6B7280), status, null),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (icon != null) ...[Icon(icon, size: 10, color: color), const SizedBox(width: 3)],
        if (status == 'ativo') ...[
          Container(width: 5, height: 5, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
          const SizedBox(width: 3),
        ],
        Text(label, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: color, letterSpacing: 0.5)),
      ]),
    );
  }
}

// ── Views Badge ──────────────────────────────────────

class _ViewsBadge extends StatelessWidget {
  const _ViewsBadge({required this.count});
  final int count;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFF4ECDC4).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        const Icon(LucideIcons.eye, size: 10, color: Color(0xFF4ECDC4)),
        const SizedBox(width: 3),
        Text('$count', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF4ECDC4), letterSpacing: 0.5)),
      ]),
    );
  }
}
