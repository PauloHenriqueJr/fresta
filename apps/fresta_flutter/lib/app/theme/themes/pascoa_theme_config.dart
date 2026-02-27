import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class PascoaThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'pascoa';

  @override
  Color get primaryColor => const Color(0xFFC084FC);

  @override
  Color get secondaryColor => const Color(0xFFF472B6);

  @override
  Color get surfaceColor => const Color(0xFFFDF4FF);

  @override
  List<Color> get headerGradient => [const Color(0xFFC084FC), const Color(0xFFF472B6)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF9333EA);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFA855F7);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFFDF4FF);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w900);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Que a doçura da Páscoa alegre seu dia!';

  @override
  String get defaultFooterMessage => 'Renovação e muita doçura para você e sua família!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _PascoaEggs();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white.withValues(alpha: 0.7),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFFC084FC).withValues(alpha: 0.3)),
      boxShadow: [
        BoxShadow(color: const Color(0xFFC084FC).withValues(alpha: 0.1), blurRadius: 12, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _PascoaBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.egg;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFFDF4FF),
    envelopeBorder: Color(0x33C084FC),
    envelopeSealStart: Color(0xFFFBBF24),
    envelopeSealEnd: Color(0xFFFB923C),
    envelopeButtonBg: Color(0xFFFBBF24),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFF3E8FF),
    lockedBorder: Color(0xFFE9D5FF),
    lockedNumberColor: Color(0xFFC084FC),
    unlockedBorder: Color(0xFF86EFAC),
    unlockedBadgeBg: Color(0xFFC084FC),
    glowColor: Color(0x40C084FC),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFFC084FC),
    iconColor: Color(0xFFF472B6),
    bgColor: Color(0xFFFDF4FF),
    borderColor: Color(0x33C084FC),
    textColor: Color(0xFF7E22CE),
    icon: Icons.egg_alt_outlined,
    title: 'O ovo ainda não quebrou! 🥚',
    message: 'Essa surpresa está escondida no jardim.',
  );
}

class _PascoaBackground extends StatelessWidget {
  final Widget child;
  const _PascoaBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(color: const Color(0xFFFDF4FF)),
        ),
        Positioned.fill(
          child: CustomPaint(painter: _EggPatternPainter()),
        ),
        child,
      ],
    );
  }
}

class _EggPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFC084FC).withValues(alpha: 0.04)
      ..style = PaintingStyle.fill;

    const spacingX = 60.0;
    const spacingY = 70.0;
    for (double x = 0; x < size.width; x += spacingX) {
      for (double y = 0; y < size.height; y += spacingY) {
        canvas.drawOval(Rect.fromCenter(center: Offset(x, y), width: 10, height: 14), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _PascoaEggs extends StatefulWidget {
  const _PascoaEggs();

  @override
  State<_PascoaEggs> createState() => _PascoaEggsState();
}

class _PascoaEggsState extends State<_PascoaEggs> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = [const Color(0xFFC084FC), const Color(0xFFF472B6), const Color(0xFF34D399), const Color(0xFFFBBF24)];
    final rng = Random(33);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(12, (i) {
            final yOff = _controller.value * 3 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.1,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Container(
                    width: 10,
                    height: 14,
                    decoration: BoxDecoration(
                      color: colors[i % colors.length],
                      borderRadius: BorderRadius.circular(7),
                    ),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
