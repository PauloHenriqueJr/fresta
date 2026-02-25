import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';

import '../application/calendar_providers.dart';

class MyCalendarsScreen extends ConsumerWidget {
  const MyCalendarsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncCalendars = ref.watch(myCalendarsProvider);
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Meus Calendários',
          style: theme.textTheme.headlineMedium?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w900,
            letterSpacing: -1.0,
          ),
        ),
      ),
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
                  Text(
                    'Ops! Algo deu errado.',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800, 
                      color: colorScheme.error,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    error.toString(),
                    textAlign: TextAlign.center,
                    style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6)),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () => ref.invalidate(myCalendarsProvider),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Tentar novamente'),
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
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
                      color: colorScheme.surface,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: colorScheme.secondary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Icon(Icons.redeem_rounded, size: 40, color: colorScheme.secondary),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Sua jornada começa aqui',
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 20,
                            color: colorScheme.onSurface,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Crie um calendário inesquecível, personalize as mensagens diárias e emocione quem o receber.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: colorScheme.onSurface.withValues(alpha: 0.6), 
                            height: 1.5,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 32),
                        FilledButton.icon(
                          onPressed: () => context.go('/creator/calendars/new'),
                          icon: const Icon(Icons.add_rounded),
                          label: const Text('Novo calendário'),
                        ),
                      ],
                    ),
                  )
                else ...[
                  for (final item in items) ...[
                    _CalendarCard(
                      title: item.title,
                      meta: '${_getThemeName(item.themeId)} • ${item.duration} dias',
                      status: item.status,
                      themeId: item.themeId,
                      onTap: () => context.go('/creator/calendars/${item.id}'),
                      onShare: () {
                        // Direct share
                        SharePlus.instance.share(
                          ShareParams(
                            text: '🎉 Tenho uma surpresa para você! Abra minha Fresta:\n\nhttps://fresta.app/c/${item.id}',
                            subject: 'Minha surpresa no Fresta',
                          ),
                        );
                      },
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

  String _getThemeName(String themeId) {
    final mapping = {
      'namoro': 'Namoro',
      'casamento': 'Casamento',
      'aniversario': 'Aniversário',
      'bodas': 'Bodas',
      'carnaval': 'Carnaval',
      'diadascriancas': 'Dia das Crianças',
      'diadasmaes': 'Dia das Mães',
      'diadospais': 'Dia dos Pães',
      'estudo': 'Estudo',
      'independencia': 'Independência',
      'metas': 'Metas',
      'natal': 'Natal',
      'noivado': 'Noivado',
      'pascoa': 'Páscoa',
      'reveillon': 'Réveillon',
      'saojoao': 'São João',
      'viagem': 'Viagem',
    };
    return mapping[themeId] ?? 'Custom';
  }
}

class _CalendarCard extends StatelessWidget {
  const _CalendarCard({
    required this.title,
    required this.meta,
    required this.status,
    required this.themeId,
    required this.onTap,
    required this.onShare,
  });

  final String title;
  final String meta;
  final String status;
  final String themeId;
  final VoidCallback onTap;
  final VoidCallback onShare;

  @override
  Widget build(BuildContext context) {
    // Fresta Status Colors
    final Color finalStatusColor;
    final String finalStatusLabel;
    
    if (status == 'ativo' || status == 'active') {
      finalStatusColor = const Color(0xFF2D7A5F);
      finalStatusLabel = 'Ativo';
    } else {
      finalStatusColor = const Color(0xFF6B7280);
      finalStatusLabel = 'Rascunho';
    }

    final imageAsset = _getThemeImageAsset(themeId);

    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
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
                // Theme Image Preview
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: finalStatusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Image.asset(
                    imageAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => 
                      Icon(Icons.calendar_month_rounded, color: finalStatusColor, size: 24),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 16,
                          color: colorScheme.onSurface,
                          letterSpacing: -0.3,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        meta, 
                        maxLines: 1, 
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: colorScheme.onSurface.withValues(alpha: 0.6),
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 10),
                      _SmallTag(label: finalStatusLabel, color: finalStatusColor),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: Icon(Icons.share_rounded, size: 22, color: colorScheme.primary),
                  onPressed: onShare,
                  style: IconButton.styleFrom(
                    backgroundColor: colorScheme.primary.withValues(alpha: 0.1),
                    padding: const EdgeInsets.all(8),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getThemeImageAsset(String themeId) {
    final mapping = {
      'namoro': 'assets/images/themes/mascot-namoro.jpg',
      'love': 'assets/images/themes/mascot-love.jpg',
      'casamento': 'assets/images/themes/mascot-casamento.jpg',
      'aniversario': 'assets/images/themes/mascot-aniversario.jpg',
      'bodas': 'assets/images/themes/mascot-bodas.jpg',
      'viagem': 'assets/images/themes/mascot-viagem.jpg',
      'natal': 'assets/images/themes/mascot-natal.jpg',
      'noivado': 'assets/images/themes/mascot-noivado.jpg',
      'pascoa': 'assets/images/themes/mascot-pascoa.jpg',
      'reveillon': 'assets/images/themes/mascot-reveillon.jpg',
      'diadasmaes': 'assets/images/themes/mascot-diadasmaes.jpg',
      'diadospais': 'assets/images/themes/mascot-diadospais.jpg',
      'diadascriancas': 'assets/images/themes/mascot-diadascriancas.jpg',
      'estudo': 'assets/images/themes/mascot-estudo.jpg',
      'metas': 'assets/images/themes/mascot-metas.jpg',
    };
    return mapping[themeId] ?? 'assets/images/themes/mascot-aniversario.jpg';
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
