import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';

class CreatorHomeScreen extends ConsumerWidget {
  const CreatorHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final asyncCalendars = ref.watch(myCalendarsProvider);
    final theme = Theme.of(context);
    final displayName = auth.profile?.displayName ?? auth.user?.email ?? 'Criador';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Meus Calendários'),
        actions: [
          IconButton(
            onPressed: () => context.go('/account/profile'),
            icon: const Icon(Icons.person_outline),
          ),
          IconButton(
            onPressed: () async {
              await ref.read(authControllerProvider.notifier).signOut();
              if (context.mounted) context.go('/viewer/welcome');
            },
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/creator/calendars/new'),
        icon: const Icon(Icons.add),
        label: const Text('Criar'),
      ),
      body: SafeArea(
        child: asyncCalendars.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Erro ao carregar seus calendários:\n$error', textAlign: TextAlign.center),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => ref.invalidate(myCalendarsProvider),
                    child: const Text('Tentar novamente'),
                  ),
                ],
              ),
            ),
          ),
          data: (items) => RefreshIndicator(
            onRefresh: () async => ref.refresh(myCalendarsProvider.future),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF164A3C), Color(0xFF236B57)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.14),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.auto_awesome_rounded, color: Colors.white),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Olá, ${displayName.split('@').first}',
                        style: theme.textTheme.headlineSmall?.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Gerencie seus calendários, edite os dias e compartilhe o link público.',
                        style: const TextStyle(color: Color(0xFFE6E2D7), height: 1.35),
                      ),
                      const SizedBox(height: 14),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _MetricPill(
                            icon: Icons.calendar_month_outlined,
                            label: '${items.length} calendário${items.length == 1 ? '' : 's'}',
                          ),
                          _MetricPill(
                            icon: Icons.lock_open_rounded,
                            label: '${items.where((c) => c.privacy == 'public').length} públicos',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                if (items.isEmpty)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Seu primeiro calendário começa aqui',
                              style: TextStyle(fontWeight: FontWeight.w700)),
                          const SizedBox(height: 8),
                          const Text(
                            'Crie um calendário B2C, personalize os dias e compartilhe o link com quem vai abrir.',
                          ),
                          const SizedBox(height: 14),
                          FilledButton.icon(
                            onPressed: () => context.go('/creator/calendars/new'),
                            icon: const Icon(Icons.add_rounded),
                            label: const Text('Criar calendário'),
                          ),
                        ],
                      ),
                    ),
                  )
                else ...[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(4, 4, 4, 10),
                    child: Text(
                      'Seus calendários',
                      style: theme.textTheme.titleMedium,
                    ),
                  ),
                  for (final item in items) ...[
                    _CalendarCard(
                      title: item.title,
                      meta: '${item.themeId} • ${item.duration} dias',
                      status: item.status,
                      privacy: item.privacy,
                      premium: item.isPremium,
                      onTap: () => context.go('/creator/calendars/${item.id}'),
                    ),
                    const SizedBox(height: 10),
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
    final statusColor = switch (status) {
      'ativo' => const Color(0xFF0E8A56),
      'finalizado' => const Color(0xFF6C5CE7),
      'aguardando_pagamento' => const Color(0xFFD86F45),
      'inativo' => const Color(0xFF8E877A),
      _ => const Color(0xFF8A6D2A),
    };

    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: onTap,
      child: Ink(
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.95),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0x13000000)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(Icons.calendar_today_rounded, color: statusColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(meta, maxLines: 1, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        _SmallTag(label: status, color: statusColor),
                        _SmallTag(
                          label: privacy == 'public' ? 'público' : 'privado',
                          color: privacy == 'public'
                              ? const Color(0xFF2D7CFF)
                              : const Color(0xFF7F7B70),
                        ),
                        if (premium)
                          const _SmallTag(label: 'premium', color: Color(0xFFB68A2A)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.chevron_right_rounded),
            ],
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
          fontSize: 11,
        ),
      ),
    );
  }
}

class _MetricPill extends StatelessWidget {
  const _MetricPill({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.white),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
          ),
        ],
      ),
    );
  }
}
