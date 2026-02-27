import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../app/theme/calendar_theme_config.dart';

/// Envelope card — day with text/link content (sealed state).
/// Matches web's UniversalEnvelopeCard.
class UniversalEnvelopeCard extends StatelessWidget {
  const UniversalEnvelopeCard({
    super.key,
    required this.dayNumber,
    required this.themeConfig,
    required this.onTap,
    this.isOpened = false,
    this.dateLabel,
  });

  final int dayNumber;
  final CalendarThemeConfig themeConfig;
  final VoidCallback onTap;
  final bool isOpened;
  final String? dateLabel;

  @override
  Widget build(BuildContext context) {
    final style = themeConfig.cardStateStyle;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : style.envelopeBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: style.envelopeBorder, width: 1.5),
          boxShadow: [
            BoxShadow(
              color: style.glowColor.withValues(alpha: 0.15),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              // Envelope triangular pattern at top
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: CustomPaint(
                  size: const Size(double.infinity, 40),
                  painter: _EnvelopeFlapPainter(
                    color: style.envelopeSealStart.withValues(alpha: 0.1),
                  ),
                ),
              ),

              // Main content
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 8),
                    // Seal circle
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [style.envelopeSealStart, style.envelopeSealEnd],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: style.envelopeSealStart.withValues(alpha: 0.4),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          '$dayNumber',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Day label
                    Text(
                      'Dia $dayNumber',
                      style: themeConfig.titleStyle.copyWith(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: themeConfig.primaryColor,
                      ),
                    ),

                    if (dateLabel != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        dateLabel!,
                        style: TextStyle(
                          fontSize: 11,
                          color: themeConfig.primaryColor.withValues(alpha: 0.5),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],

                    const SizedBox(height: 12),

                    // Already opened overlay OR Open button
                    if (isOpened)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.visibility_outlined, size: 14, color: Colors.grey.shade600),
                            const SizedBox(width: 4),
                            Text(
                              'Já aberto',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: style.envelopeButtonGradient != null ? null : style.envelopeButtonBg,
                          gradient: style.envelopeButtonGradient != null
                              ? LinearGradient(
                                  colors: [style.envelopeSealStart, style.envelopeSealEnd],
                                )
                              : null,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'ABRIR',
                          style: TextStyle(
                            color: style.envelopeButtonText,
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Locked card — future day that can't be opened yet.
/// Matches web's UniversalLockedCard.
class UniversalLockedCard extends StatelessWidget {
  const UniversalLockedCard({
    super.key,
    required this.dayNumber,
    required this.themeConfig,
    required this.onTap,
    this.daysUntilUnlock = 0,
    this.dateLabel,
  });

  final int dayNumber;
  final CalendarThemeConfig themeConfig;
  final VoidCallback onTap;
  final int daysUntilUnlock;
  final String? dateLabel;

  @override
  Widget build(BuildContext context) {
    final style = themeConfig.cardStateStyle;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5) : style.lockedBg,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isDark ? Colors.white.withValues(alpha: 0.1) : style.lockedBorder,
            width: 1,
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              // Stripe pattern background
              Positioned.fill(
                child: CustomPaint(
                  painter: _StripePatternPainter(
                    color: style.lockedBorder.withValues(alpha: 0.3),
                  ),
                ),
              ),

              // Lock icon
              Positioned(
                top: 12,
                right: 12,
                child: Icon(
                  LucideIcons.lock,
                  size: 14,
                  color: isDark ? Colors.white38 : style.lockedNumberColor,
                ),
              ),

              // Content
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$dayNumber',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: isDark ? Colors.white24 : style.lockedNumberColor.withValues(alpha: 0.4),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Bloqueado',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: isDark ? Colors.white38 : style.lockedNumberColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                      if (dateLabel != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          dateLabel!,
                          style: TextStyle(
                            fontSize: 9,
                            color: isDark ? Colors.white24 : style.lockedNumberColor.withValues(alpha: 0.5),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                      if (daysUntilUnlock > 0) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: themeConfig.primaryColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Abre em ${daysUntilUnlock}d',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              color: themeConfig.primaryColor.withValues(alpha: 0.6),
                            ),
                          ),
                        ),
                      ],
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

/// Unlocked card — day with media (photo/video) that's already been opened.
/// Matches web's UniversalUnlockedCard.
class UniversalUnlockedCard extends StatelessWidget {
  const UniversalUnlockedCard({
    super.key,
    required this.dayNumber,
    required this.themeConfig,
    required this.onTap,
    this.contentType,
    this.mediaUrl,
    this.dateLabel,
    this.openedCount = 0,
  });

  final int dayNumber;
  final CalendarThemeConfig themeConfig;
  final VoidCallback onTap;
  final String? contentType;
  final String? mediaUrl;
  final String? dateLabel;
  final int openedCount;

  bool get _isVideo {
    if (mediaUrl == null) return false;
    return mediaUrl!.contains('youtube.com') ||
        mediaUrl!.contains('youtu.be') ||
        mediaUrl!.contains('tiktok.com') ||
        mediaUrl!.contains('instagram.com');
  }
  bool get _isMusic =>
      contentType == 'music' || (mediaUrl?.contains('spotify.com') ?? false);
  bool get _isPhoto => (contentType == 'photo' || contentType == 'gif') && !_isVideo && !_isMusic;

  @override
  Widget build(BuildContext context) {
    final style = themeConfig.cardStateStyle;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: style.unlockedBorder, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              // Background based on content type
              if (_isPhoto && mediaUrl != null)
                Positioned.fill(
                  child: Image.network(
                    mediaUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (c, e, s) => Container(
                      color: themeConfig.primaryColor.withValues(alpha: 0.05),
                    ),
                  ),
                ),
              if (_isVideo)
                Positioned.fill(
                  child: Container(
                    color: Colors.black87,
                    child: const Center(
                      child: Icon(Icons.play_circle_outline, size: 48, color: Colors.white70),
                    ),
                  ),
                ),
              if (_isMusic)
                Positioned.fill(
                  child: Container(
                    color: const Color(0xFF1DB954).withValues(alpha: 0.1),
                    child: const Center(
                      child: Icon(Icons.music_note_rounded, size: 48, color: Color(0xFF1DB954)),
                    ),
                  ),
                ),
              if (!_isPhoto && !_isVideo && !_isMusic)
                Positioned.fill(
                  child: CustomPaint(
                    painter: _TextPatternPainter(
                      color: themeConfig.primaryColor.withValues(alpha: 0.04),
                    ),
                  ),
                ),

              // Blur overlay for opened cards
              if (_isPhoto && mediaUrl != null)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.1),
                          Colors.black.withValues(alpha: 0.6),
                        ],
                      ),
                    ),
                  ),
                ),

              // Day badge
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: style.unlockedBadgeBg,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: style.unlockedBadgeBg.withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    'Dia $dayNumber',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),

              // Content info at bottom
              Positioned(
                bottom: 12,
                left: 12,
                right: 12,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (dateLabel != null)
                      Text(
                        dateLabel!,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: _isPhoto ? Colors.white70 : themeConfig.primaryColor.withValues(alpha: 0.5),
                        ),
                      ),
                    const SizedBox(height: 4),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: themeConfig.primaryColor,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        'VER NOVAMENTE',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Empty card — day with no content yet (editor only).
class UniversalEmptyCard extends StatelessWidget {
  const UniversalEmptyCard({
    super.key,
    required this.dayNumber,
    required this.themeConfig,
    required this.onTap,
  });

  final int dayNumber;
  final CalendarThemeConfig themeConfig;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: themeConfig.primaryColor.withValues(alpha: 0.15),
            width: 2,
            strokeAlign: BorderSide.strokeAlignInside,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: themeConfig.primaryColor.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  LucideIcons.plus,
                  size: 20,
                  color: themeConfig.primaryColor.withValues(alpha: 0.3),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Dia $dayNumber',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: themeConfig.primaryColor.withValues(alpha: 0.3),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Adicionar',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: themeConfig.primaryColor.withValues(alpha: 0.2),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// Custom painters for card patterns
// ─────────────────────────────────────────────

class _EnvelopeFlapPainter extends CustomPainter {
  _EnvelopeFlapPainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width / 2, size.height)
      ..lineTo(size.width, 0)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _StripePatternPainter extends CustomPainter {
  _StripePatternPainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1;
    const spacing = 12.0;
    for (double i = -size.height; i < size.width + size.height; i += spacing) {
      canvas.drawLine(
        Offset(i, 0),
        Offset(i + size.height, size.height),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _TextPatternPainter extends CustomPainter {
  _TextPatternPainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1;
    const spacing = 16.0;
    for (double y = spacing; y < size.height; y += spacing) {
      canvas.drawLine(Offset(16, y), Offset(size.width - 16, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
