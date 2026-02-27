import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class BirthdayThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'aniversario';

  @override
  Color get primaryColor => const Color(0xFF0EA5E9);
  
  @override
  Color get secondaryColor => const Color(0xFF6366F1);
  
  @override
  Color get surfaceColor => const Color(0xFFF0F9FF);

  @override
  List<Color> get headerGradient => [const Color(0xFF0EA5E9), const Color(0xFF6366F1)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF0EA5E9);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF0EA5E9).withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFF0F9FF);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.kalam(fontWeight: FontWeight.bold);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Desejando um dia repleto de alegrias!';

  @override
  String get defaultFooterMessage => 'Que seu novo ciclo seja incrível!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _BirthdayBalloons();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFBAE6FD).withValues(alpha: 0.5), width: 2),
      boxShadow: [
        BoxShadow(color: const Color(0xFF0EA5E9).withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _BirthdayBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.partyPopper;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFF0F9FF),
    envelopeBorder: Color(0x330EA5E9),
    envelopeSealStart: Color(0xFF0EA5E9),
    envelopeSealEnd: Color(0xFF6366F1),
    envelopeButtonBg: Color(0xFF0EA5E9),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFE0F2FE),
    lockedBorder: Color(0xFFBAE6FD),
    lockedNumberColor: Color(0xFF7DD3FC),
    unlockedBorder: Color(0xFFBAE6FD),
    unlockedBadgeBg: Color(0xFF0EA5E9),
    glowColor: Color(0x4D0EA5E9),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFF0EA5E9),
    iconColor: Color(0xFF6366F1),
    bgColor: Color(0xFFF0F9FF),
    borderColor: Color(0x330EA5E9),
    textColor: Color(0xFF0369A1),
    icon: Icons.cake,
    title: 'Ainda não! 🎂',
    message: 'Essa surpresa ainda está sendo preparada!',
  );
}

class _BirthdayBackground extends StatelessWidget {
  final Widget child;
  const _BirthdayBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(child: Container(color: const Color(0xFFF0F9FF))),
        Positioned.fill(child: CustomPaint(painter: _BirthdayPatternPainter())),
        child,
      ],
    );
  }
}

class _BirthdayPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final colors = [
      const Color(0xFF0EA5E9).withValues(alpha: 0.04),
      const Color(0xFF6366F1).withValues(alpha: 0.04),
      const Color(0xFFF59E0B).withValues(alpha: 0.04),
    ];
    const spacing = 50.0;
    int idx = 0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        final paint = Paint()..color = colors[idx % colors.length];
        canvas.drawCircle(Offset(x, y), 3, paint);
        idx++;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BirthdayBalloons extends StatefulWidget {
  const _BirthdayBalloons();

  @override
  State<_BirthdayBalloons> createState() => _BirthdayBalloonsState();
}

class _BirthdayBalloonsState extends State<_BirthdayBalloons> with SingleTickerProviderStateMixin {
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
    final rng = Random(22);
    final icons = [LucideIcons.partyPopper, LucideIcons.cake, LucideIcons.star, LucideIcons.gift];
    final colors = [const Color(0xFF0EA5E9), const Color(0xFF6366F1), const Color(0xFFF59E0B), const Color(0xFFEC4899)];
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(12, (i) {
            final yOff = _controller.value * 5 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.08,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Icon(icons[i % icons.length], size: 10 + rng.nextDouble() * 6, color: colors[i % colors.length]),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
