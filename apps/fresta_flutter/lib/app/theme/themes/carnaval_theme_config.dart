import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class CarnavalThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'carnaval';

  @override
  Color get primaryColor => const Color(0xFF9333EA);

  @override
  Color get secondaryColor => const Color(0xFFEC4899);

  @override
  Color get surfaceColor => const Color(0xFFFDF4FF);

  @override
  List<Color> get headerGradient => [const Color(0xFF9333EA), const Color(0xFFEC4899)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF7E22CE);
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
  TextStyle get titleStyle => GoogleFonts.fredoka(fontWeight: FontWeight.w700);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Prepare sua fantasia, a festa vai começar!';

  @override
  String get defaultFooterMessage => 'A alegria do Carnaval dura o ano inteiro com você!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _CarnavalConfetti();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF9333EA).withValues(alpha: 0.2)),
      boxShadow: [
        BoxShadow(color: const Color(0xFF9333EA).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _CarnavalBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.partyPopper;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFFDF4FF),
    envelopeBorder: Color(0x339333EA),
    envelopeSealStart: Color(0xFF9333EA),
    envelopeSealEnd: Color(0xFFEC4899),
    envelopeButtonBg: Color(0xFF9333EA),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFF3E8FF),
    lockedBorder: Color(0xFFE9D5FF),
    lockedNumberColor: Color(0xFFC084FC),
    unlockedBorder: Color(0xFFE9D5FF),
    unlockedBadgeBg: Color(0xFF9333EA),
    glowColor: Color(0x4D9333EA),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFF9333EA),
    iconColor: Color(0xFFEC4899),
    bgColor: Color(0xFFFDF4FF),
    borderColor: Color(0x339333EA),
    textColor: Color(0xFF7E22CE),
    icon: Icons.celebration,
    title: 'Opa, ainda não! 🎭',
    message: 'Essa folia ainda está sendo preparada.',
  );
}

class _CarnavalBackground extends StatelessWidget {
  final Widget child;
  const _CarnavalBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: CustomPaint(painter: _CarnavalPatternPainter()),
        ),
        child,
      ],
    );
  }
}

class _CarnavalPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final colors = [
      const Color(0xFF9333EA).withValues(alpha: 0.04),
      const Color(0xFFEC4899).withValues(alpha: 0.04),
      const Color(0xFFFBBF24).withValues(alpha: 0.04),
    ];
    const spacing = 50.0;
    int colorIdx = 0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        final paint = Paint()..color = colors[colorIdx % colors.length];
        canvas.drawCircle(Offset(x, y), 4, paint);
        colorIdx++;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CarnavalConfetti extends StatefulWidget {
  const _CarnavalConfetti();

  @override
  State<_CarnavalConfetti> createState() => _CarnavalConfettiState();
}

class _CarnavalConfettiState extends State<_CarnavalConfetti> with SingleTickerProviderStateMixin {
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
    final colors = [const Color(0xFF9333EA), const Color(0xFFEC4899), const Color(0xFFFBBF24), const Color(0xFF06B6D4)];
    final rng = Random(42);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(20, (i) {
            final yOff = _controller.value * 4 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 10),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 10),
              child: Opacity(
                opacity: 0.12,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Transform.rotate(
                    angle: rng.nextDouble() * pi,
                    child: Container(width: 6, height: 10, color: colors[i % colors.length]),
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
