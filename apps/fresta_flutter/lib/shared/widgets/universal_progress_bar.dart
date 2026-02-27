import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../app/theme/calendar_theme_config.dart';

/// Universal progress bar matching web's UniversalTemplate progress bar.
/// Shows completion percentage across all themes.
class UniversalProgressBar extends StatelessWidget {
  const UniversalProgressBar({
    super.key,
    required this.openedDays,
    required this.totalDays,
    required this.themeConfig,
  });

  final int openedDays;
  final int totalDays;
  final CalendarThemeConfig themeConfig;

  double get _progress => totalDays > 0 ? (openedDays / totalDays).clamp(0.0, 1.0) : 0;
  int get _percent => (_progress * 100).round();

  @override
  Widget build(BuildContext context) {
    final isDark = themeConfig.isDarkTheme;
    final trackColor = isDark
        ? Colors.white.withValues(alpha: 0.1)
        : themeConfig.primaryColor.withValues(alpha: 0.1);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: isDark
            ? Colors.black.withValues(alpha: 0.3)
            : Colors.white.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.1)
              : themeConfig.primaryColor.withValues(alpha: 0.1),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$openedDays/$totalDays abertos',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isDark
                      ? Colors.white.withValues(alpha: 0.7)
                      : themeConfig.primaryColor.withValues(alpha: 0.7),
                ),
              ),
              Text(
                '$_percent%',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : themeConfig.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 8,
              child: Stack(
                children: [
                  // Track
                  Container(
                    decoration: BoxDecoration(
                      color: trackColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  // Fill
                  FractionallySizedBox(
                    widthFactor: _progress,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: themeConfig.headerGradient,
                        ),
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: themeConfig.primaryColor.withValues(alpha: 0.4),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_percent == 100) ...[
            const SizedBox(height: 8),
            Text(
              '🎉 Todos os dias abertos!',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: themeConfig.primaryColor,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
