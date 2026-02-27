import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class DiadospaisThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'diadospais';

  @override
  Color get primaryColor => const Color(0xFF475569);

  @override
  Color get secondaryColor => const Color(0xFF2563EB);

  @override
  Color get surfaceColor => const Color(0xFFF1F5F9);

  @override
  List<Color> get headerGradient => [const Color(0xFF475569), const Color(0xFF2563EB)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF334155);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF64748B);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Theme.of(context).scaffoldBackgroundColor
        : const Color(0xFFF1F5F9);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Homenagem ao meu grande herói';

  @override
  String get defaultFooterMessage => 'Com admiração e gratidão, feliz dia dos pais!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _FloatingElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return BoxDecoration(
      color: isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF475569).withValues(alpha: 0.15)),
      boxShadow: [
        BoxShadow(color: const Color(0xFF475569).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _DiadospaisBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.crown;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFF1F5F9),
    envelopeBorder: Color(0x33475569),
    envelopeSealStart: Color(0xFF475569),
    envelopeSealEnd: Color(0xFF2563EB),
    envelopeButtonBg: Color(0xFF475569),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFE2E8F0),
    lockedBorder: Color(0xFFCBD5E1),
    lockedNumberColor: Color(0xFF94A3B8),
    unlockedBorder: Color(0xFFCBD5E1),
    unlockedBadgeBg: Color(0xFF475569),
    glowColor: Color(0x4D475569),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFF475569),
    iconColor: Color(0xFF2563EB),
    bgColor: Color(0xFFF1F5F9),
    borderColor: Color(0x33475569),
    textColor: Color(0xFF334155),
    icon: Icons.shield_outlined,
    title: 'Calma, pai! 👔',
    message: 'Essa homenagem está sendo preparada com carinho.',
  );
}

class _DiadospaisBackground extends StatelessWidget {
  final Widget child;
  const _DiadospaisBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(color: const Color(0xFFF1F5F9)),
        ),
        Positioned.fill(
          child: CustomPaint(painter: _StripePatternPainter()),
        ),
        child,
      ],
    );
  }
}

class _StripePatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E3A5F).withValues(alpha: 0.03)
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _FloatingElements extends StatefulWidget {
  const _FloatingElements();

  @override
  State<_FloatingElements> createState() => _FloatingElementsState();
}

class _FloatingElementsState extends State<_FloatingElements> with SingleTickerProviderStateMixin {
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
    final rng = Random(88);
    final icons = [LucideIcons.crown, LucideIcons.star, LucideIcons.award];
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(10, (i) {
            final yOff = _controller.value * 3 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.06,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Icon(
                    icons[i % icons.length],
                    size: 10 + rng.nextDouble() * 6,
                    color: const Color(0xFF475569),
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
