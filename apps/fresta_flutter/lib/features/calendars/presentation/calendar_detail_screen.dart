import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/utils/fresta_urls.dart';
import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';
import '../../../app/theme/dating_theme.dart';

class CalendarDetailScreen extends ConsumerWidget {
  const CalendarDetailScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(calendarId));
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            onPressed: () {
              if (context.canPop()) {
                context.pop();
              } else {
                context.go('/creator/home');
              }
            },
            icon: Icon(Icons.arrow_back_ios_new_rounded, color: colorScheme.onSurface),
            style: IconButton.styleFrom(
              backgroundColor: colorScheme.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        title: Text(
          'Detalhes',
          style: theme.textTheme.titleLarge?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
          ),
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: IconButton(
              onPressed: () {
                final url = FrestaUrls.calendarShareUrl(calendarId);
                 SharePlus.instance.share(
                  ShareParams(text: url),
                );
              },
              icon: Icon(Icons.ios_share_rounded, color: colorScheme.onSurface),
              tooltip: 'Compartilhar',
              style: IconButton.styleFrom(
                backgroundColor: colorScheme.surface,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: asyncDetail.when(
        loading: () => const Center(
          child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F))),
        ),
        error: (error, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFDC2626)),
                const SizedBox(height: 16),
                const Text(
                  'Ops! Algo deu errado ao carregar.',
                  style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF991B1B), fontSize: 18),
                ),
                const SizedBox(height: 8),
                Text(
                  error.toString(),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Color(0xFF5A7470)),
                ),
              ],
            ),
          ),
        ),
        data: (detail) {
          if (detail == null) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                   Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Icon(Icons.calendar_month_rounded, size: 40, color: Color(0xFF9CA3AF)),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Calendário não encontrado.', 
                    style: TextStyle(
                      color: Color(0xFF1B4D3E), 
                      fontSize: 18, 
                      fontWeight: FontWeight.bold
                    ),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.tonal(
                    onPressed: () => context.go('/creator/home'),
                    style: FilledButton.styleFrom(
                       backgroundColor: colorScheme.primary.withValues(alpha: 0.1),
                       foregroundColor: colorScheme.primary,
                       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                    ),
                    child: const Text('Voltar para o início', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }
          
          final openedDays = 0; // detail.days.where((d) => d.isOpened == true).length;
          final filledDays = detail.days.where((d) => (d.message ?? '').trim().isNotEmpty).length;

          final isDating = detail.calendar.themeId == 'namoro';

          Widget mainContent = Stack(
            children: [
              if (isDating) const FloatingHearts(),
              CustomScrollView(
                slivers: [
                  if (isDating)
                    SliverAppBar(
                      backgroundColor: Colors.transparent,
                      elevation: 0,
                      pinned: true,
                      expandedHeight: 120,
                      flexibleSpace: const HangingHeartsHeader(),
                      leading: const SizedBox.shrink(), // App bar has its own leading
                      actions: const [SizedBox.shrink()],
                    ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                      child: Column(
                        children: [
                          // Main Header Card
                          Container(
                            padding: const EdgeInsets.all(32),
                            decoration: BoxDecoration(
                              gradient: isDating 
                                ? const LinearGradient(colors: DatingTheme.blushGradient)
                                : LinearGradient(
                                    colors: [colorScheme.tertiary, colorScheme.primary],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                              borderRadius: BorderRadius.circular(32),
                              boxShadow: [
                                BoxShadow(
                                  color: (isDating ? DatingTheme.loveRed : colorScheme.tertiary).withValues(alpha: 0.2), 
                                  blurRadius: 24, 
                                  offset: const Offset(0, 12)
                                ),
                              ],
                            ),
                            child: Stack(
                              children: [
                                Positioned(
                                  top: -60,
                                  right: -40,
                                  child: Container(
                                    width: 150,
                                    height: 150,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      gradient: RadialGradient(
                                        colors: [Color(0x30F9A03F), Colors.transparent],
                                      ),
                                    ),
                                  ),
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.2),
                                            borderRadius: BorderRadius.circular(999),
                                          ),
                                          child: Text(
                                            detail.calendar.status == 'ativo' ? 'Ativo' : 'Rascunho',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: IconButton(
                                            onPressed: () => context.go('/creator/calendars/$calendarId/edit'),
                                            icon: const Icon(Icons.edit_rounded, color: Colors.white, size: 20),
                                            tooltip: 'Editar Calendário',
                                            constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                                            padding: EdgeInsets.zero,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      detail.calendar.title,
                                      textAlign: TextAlign.center,
                                      style: isDating 
                                        ? DatingTheme.display.copyWith(color: Colors.white, fontSize: 32)
                                        : const TextStyle(
                                            color: Colors.white,
                                            fontSize: 28,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: -0.5,
                                            height: 1.1,
                                          ),
                                    ),
                                    if (isDating) ...[
                                      const SizedBox(height: 8),
                                      Text(
                                        detail.calendar.headerMessage?.isNotEmpty == true
                                            ? detail.calendar.headerMessage!
                                            : 'Uma jornada de amor para nós dois',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          color: Colors.white.withValues(alpha: 0.9),
                                          fontSize: 16,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                    const SizedBox(height: 8),
                                    Text(
                                      '${detail.calendar.duration} dias • Tema ${detail.calendar.themeId}',
                                       style: TextStyle(
                                        color: Colors.white.withValues(alpha: 0.8),
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    FilledButton(
                                      onPressed: () {
                                        final url = FrestaUrls.calendarShareUrl(calendarId);
                                        SharePlus.instance.share(
                                          ShareParams(text: url),
                                        );
                                      },
                                      style: FilledButton.styleFrom(
                                        backgroundColor: Colors.white,
                                        foregroundColor: const Color(0xFF1B4D3E),
                                        minimumSize: const Size.fromHeight(48),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(24),
                                        ),
                                      ),
                                      child: const Text('Enviar Presente', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          
                          const SizedBox(height: 24),

                          // Stats Grid
                          Row(
                            children: [
                              Expanded(
                                child: _StatCard(
                                  title: 'Visualizações',
                                  value: openedDays.toString(),
                                  total: '', // total removed as per design
                                  icon: Icons.visibility_rounded,
                                  color: colorScheme.secondary, 
                                  bgColor: colorScheme.secondary.withValues(alpha: 0.1),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _StatCard(
                                  title: 'Concluído',
                                  value: '${((filledDays / detail.calendar.duration) * 100).toInt()}%',
                                  total: '', // total removed as per design
                                  icon: Icons.check_circle_rounded,
                                  color: colorScheme.primary, 
                                  bgColor: colorScheme.primary.withValues(alpha: 0.1),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Dias',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: colorScheme.onSurface,
                              letterSpacing: -0.5,
                            ),
                          ),
                          Text(
                            '$filledDays / ${detail.calendar.duration} preenchidos',
                            style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.6), fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 48),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.75, // Matching the shared viewer
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final day = detail.days[index];
                          final hasContent = (day.message ?? '').trim().isNotEmpty || (day.url ?? '').trim().isNotEmpty;
                          
                          return Container(
                            decoration: BoxDecoration(
                              color: isDating ? DatingTheme.lightRose : Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border: isDating
                                  ? Border.all(color: DatingTheme.loveRed.withValues(alpha: 0.1), width: 1.5)
                                  : null,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.04), 
                                  blurRadius: 12, 
                                  offset: const Offset(0, 4)
                                ),
                              ],
                            ),
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                borderRadius: BorderRadius.circular(24),
                                onTap: () => context.go('/creator/calendars/$calendarId/day/${day.day}'),
                                child: Padding(
                                  padding: const EdgeInsets.all(12),
                                  child: Stack(
                                    children: [
                                      Positioned(
                                        top: 0,
                                        right: 0,
                                        child: Container(
                                          padding: const EdgeInsets.all(6),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            shape: BoxShape.circle,
                                            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],
                                          ),
                                          child: Icon(
                                            Icons.edit_rounded, 
                                            size: 14, 
                                            color: isDating ? DatingTheme.loveRed : Colors.grey.shade600
                                          ),
                                        ),
                                      ),
                                      Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            'Dia ${day.day}',
                                            style: isDating 
                                                ? DatingTheme.display.copyWith(fontSize: 24, color: DatingTheme.loveRed)
                                                : TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: colorScheme.onSurface),
                                          ),
                                          if (isDating && !hasContent)
                                            Expanded(
                                              child: Center(
                                                child: Opacity(
                                                  opacity: 0.05,
                                                  child: Icon(Icons.favorite, size: 64, color: DatingTheme.loveRed),
                                                ),
                                              ),
                                            ),
                                          if (!isDating && !hasContent)
                                            Expanded(child: Center(child: Icon(Icons.image_not_supported_rounded, color: Colors.grey.shade300, size: 40))),
                                          const Spacer(),
                                          FilledButton.icon(
                                            onPressed: () => context.go('/creator/calendars/$calendarId/day/${day.day}'),
                                            icon: const Icon(Icons.edit, size: 14),
                                            label: const Text('EDITAR', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                            style: FilledButton.styleFrom(
                                              backgroundColor: isDating ? DatingTheme.loveRed : colorScheme.primary,
                                              minimumSize: const Size.fromHeight(36),
                                              padding: EdgeInsets.zero,
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                        childCount: detail.days.length,
                      ),
                    ),
                  ),
                  if (isDating)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(32),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: DatingTheme.loveRed.withValues(alpha: 0.1)),
                                boxShadow: [
                                  BoxShadow(color: DatingTheme.loveRed.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, 10)),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Icon(LucideIcons.quote, size: 40, color: DatingTheme.loveRed),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'MENSAGENS DE AMOR',
                                    style: TextStyle(color: DatingTheme.loveRed, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    detail.calendar.footerMessage?.isNotEmpty == true
                                        ? detail.calendar.footerMessage!
                                        : '"CADA DIA AO SEU LADO É UM NOVO CAPÍTULO DA NOSSA HISTÓRIA DE AMOR. ❤️"',
                                    textAlign: TextAlign.center,
                                    style: DatingTheme.display.copyWith(fontSize: 20, color: DatingTheme.loveRed),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ],
          );

          return SafeArea(
            bottom: false,
            child: isDating ? DatingBackground(child: mainContent) : mainContent,
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String total;
  final IconData icon;
  final Color color;
  final Color bgColor;

  const _StatCard({
    required this.title,
    required this.value,
    required this.total,
    required this.icon,
    required this.color,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              color: color.withValues(alpha: 0.8),
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                ),
              ),
              if (total.isNotEmpty)  
                Padding(
                  padding: const EdgeInsets.only(bottom: 4, left: 4),
                  child: Text(
                    '/ $total',
                    style: TextStyle(
                      color: color.withValues(alpha: 0.5),
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
