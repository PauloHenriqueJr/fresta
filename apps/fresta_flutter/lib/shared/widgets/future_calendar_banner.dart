import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../app/theme/calendar_theme_config.dart';

/// Banner shown when the calendar has a future start date.
/// Matches web's "Estreia em X dias" banner behavior.
class FutureCalendarBanner extends StatelessWidget {
  const FutureCalendarBanner({
    super.key,
    required this.startDate,
    required this.themeConfig,
  });

  final DateTime startDate;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final diff = startDate.difference(now);
    if (diff.isNegative) return const SizedBox.shrink();

    final daysUntil = diff.inDays;
    final isDark = themeConfig.isDarkTheme;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            themeConfig.primaryColor.withValues(alpha: isDark ? 0.3 : 0.08),
            themeConfig.primaryColor.withValues(alpha: isDark ? 0.15 : 0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: themeConfig.primaryColor.withValues(alpha: isDark ? 0.3 : 0.15),
        ),
      ),
      child: Column(
        children: [
          Icon(
            Icons.event_outlined,
            size: 32,
            color: isDark
                ? Colors.white.withValues(alpha: 0.8)
                : themeConfig.primaryColor.withValues(alpha: 0.7),
          ),
          const SizedBox(height: 12),
          Text(
            daysUntil == 0
                ? 'Estreia hoje! 🎉'
                : daysUntil == 1
                    ? 'Estreia amanhã! ⭐'
                    : 'Estreia em $daysUntil dias',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: isDark ? Colors.white : themeConfig.primaryColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            _formatDate(startDate),
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isDark
                  ? Colors.white.withValues(alpha: 0.6)
                  : themeConfig.primaryColor.withValues(alpha: 0.5),
            ),
          ),
          if (daysUntil > 0) ...[
            const SizedBox(height: 16),
            Text(
              'A antecipação é a melhor parte da festa ✨',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                fontStyle: FontStyle.italic,
                color: isDark
                    ? Colors.white.withValues(alpha: 0.4)
                    : themeConfig.primaryColor.withValues(alpha: 0.35),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ];
    return '${date.day} de ${months[date.month - 1]} de ${date.year}';
  }
}
