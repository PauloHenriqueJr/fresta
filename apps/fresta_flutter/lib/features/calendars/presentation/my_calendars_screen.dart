import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../application/calendar_providers.dart';

class MyCalendarsScreen extends ConsumerWidget {
  const MyCalendarsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncCalendars = ref.watch(myCalendarsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Meus Calendários',
          style: theme.textTheme.headlineMedium?.copyWith(
            color: const Color(0xFF1B4D3E),
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: SafeArea(
        child: asyncCalendars.when(
          loading: () => const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F)),
            ),
          ),
          error: (error, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFDC2626)),
                  const SizedBox(height: 16),
                  Text(
                    'Ops! Algo deu errado.',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700, color: const Color(0xFF991B1B)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    error.toString(),
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Color(0xFF5A7470)),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () => ref.invalidate(myCalendarsProvider),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Tentar novamente'),
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF1B4D3E), // Deep Green
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          data: (items) => RefreshIndicator(
            onRefresh: () async => ref.refresh(myCalendarsProvider.future),
            color: const Color(0xFF2D7A5F),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 100),
              children: [
                if (items.isEmpty)
                  // Empty state
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x08000000),
                          blurRadius: 16,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF7E6),
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: const Icon(Icons.redeem_rounded, size: 40, color: Color(0xFFF9A03F)),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Sua jornada começa aqui',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 18,
                            color: Color(0xFF1B4D3E),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Crie um calendário inesquecível, personalize as mensagens diárias e emocione quem o receber.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Color(0xFF5A7470), height: 1.5),
                        ),
                        const SizedBox(height: 24),
                        FilledButton.icon(
                          onPressed: () => context.go('/creator/calendars/new'),
                          icon: const Icon(Icons.add_rounded),
                          label: const Text('Novo calendário', style: TextStyle(fontWeight: FontWeight.w700)),
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF1B4D3E),
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                          ),
                        ),
                      ],
                    ),
                  )
                else ...[
                  for (final item in items) ...[
                    _CalendarCard(
                      title: item.title,
                      meta: '${item.themeId} • ${item.duration} dias',
                      status: item.status,
                      privacy: item.privacy,
                      premium: item.isPremium,
                      onTap: () => context.go('/creator/calendars/${item.id}'),
                    ),
                    const SizedBox(height: 12),
                  ],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CalendarCard extends StatelessWidget {
  const _CalendarCard({
    required this.title,
    required this.meta,
    required this.status,
    required this.privacy,
    required this.premium,
    required this.onTap,
  });

  final String title;
  final String meta;
  final String status;
  final String privacy;
  final bool premium;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    // Fresta Status Colors
    final Color finalStatusColor;
    final String finalStatusLabel;
    
    // Simplification for the new UI design map
    
    if (status == 'ativo' || status == 'active') {
      finalStatusColor = const Color(0xFF2D7A5F); // Forest Green
      finalStatusLabel = 'Ativo';
    } else {
      finalStatusColor = const Color(0xFF6B7280); // Gray
      finalStatusLabel = 'Rascunho';
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 16,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: onTap,
          splashColor: finalStatusColor.withValues(alpha: 0.1),
          highlightColor: finalStatusColor.withValues(alpha: 0.05),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: finalStatusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(Icons.calendar_month_rounded, color: finalStatusColor, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                          color: Color(0xFF1B4D3E),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        meta, 
                        maxLines: 1, 
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF5A7470),
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          _SmallTag(label: finalStatusLabel, color: finalStatusColor),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.share_rounded, size: 20, color: Color(0xFF9CA3AF)),
                      onPressed: () {
                         // TODO share link
                      },
                    ),
                    const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SmallTag extends StatelessWidget {
  const _SmallTag({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(999),
        // border: Border.all(color: color.withValues(alpha: 0.15)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
          fontSize: 11,
          letterSpacing: 0.2,
        ),
      ),
    );
  }
}
