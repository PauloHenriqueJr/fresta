import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/utils/fresta_urls.dart';
import '../application/calendar_providers.dart';

class CalendarDetailScreen extends ConsumerWidget {
  const CalendarDetailScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(calendarId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalhe do Calendário'),
        actions: [
          IconButton(
            onPressed: () => SharePlus.instance.share(
              ShareParams(text: FrestaUrls.calendarShareUrl(calendarId)),
            ),
            icon: const Icon(Icons.share),
          ),
        ],
      ),
      body: asyncDetail.when(
        data: (detail) {
          if (detail == null) {
            return const Center(child: Text('Calendário não encontrado.'));
          }

          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
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
                      Text(
                        detail.calendar.title,
                        style: Theme.of(context)
                            .textTheme
                            .headlineSmall
                            ?.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _DetailPill(label: 'Tema: ${detail.calendar.themeId}'),
                          _DetailPill(label: 'Status: ${detail.calendar.status}'),
                          _DetailPill(label: 'Privacidade: ${detail.calendar.privacy}'),
                          if (detail.hasPassword) const _DetailPill(label: 'Com senha'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton.tonalIcon(
                  onPressed: () => context.go('/creator/calendars/$calendarId/edit'),
                  icon: const Icon(Icons.edit_outlined),
                  label: const Text('Editar calendário'),
                ),
                const SizedBox(height: 12),
                Text(
                  'Dias',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                for (final day in detail.days)
                  Card(
                    child: ListTile(
                      title: Text('Dia ${day.day}'),
                      subtitle: Text(
                        (day.message ?? '').trim().isEmpty
                            ? 'Sem conteúdo'
                            : day.message!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => context.go('/creator/calendars/$calendarId/day/${day.day}'),
                    ),
                  ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Erro: $error')),
      ),
    );
  }
}

class _DetailPill extends StatelessWidget {
  const _DetailPill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}
