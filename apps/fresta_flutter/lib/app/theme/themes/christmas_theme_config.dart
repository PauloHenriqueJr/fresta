import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class ChristmasThemeConfig extends CalendarThemeConfig {
  @override
  String get id => 'natal';

  @override
  Color get primaryColor => const Color(0xFFDC2626);
  
  @override
  Color get secondaryColor => const Color(0xFF16A34A);
  
  @override
  Color get surfaceColor => const Color(0xFFFDF5E6);

  @override
  List<Color> get headerGradient => [const Color(0xFFDC2626), const Color(0xFFB91C1C)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFB91C1C);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF15803D);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFFDF5E6);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.kalam(fontWeight: FontWeight.w900);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Que a magia do Natal ilumine seu coração';

  @override
  String get defaultFooterMessage => 'Feliz Natal e um próspero Ano Novo!';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _ChristmasSnowflakes();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFFDC2626).withValues(alpha: 0.5), width: 3),
      boxShadow: [
        BoxShadow(color: const Color(0xFFDC2626).withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _ChristmasBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.gift;

  @override
  IconData get lockedIcon => LucideIcons.lock;

  @override
  CardStateStyle get cardStateStyle => const CardStateStyle(
    envelopeBg: Color(0xFFFEF2F2),
    envelopeBorder: Color(0x33DC2626),
    envelopeSealStart: Color(0xFFDC2626),
    envelopeSealEnd: Color(0xFF16A34A),
    envelopeButtonBg: Color(0xFFDC2626),
    envelopeButtonText: Colors.white,
    lockedBg: Color(0xFFF0FDF4),
    lockedBorder: Color(0xFFDCFCE7),
    lockedNumberColor: Color(0xFF86EFAC),
    unlockedBorder: Color(0xFFDCFCE7),
    unlockedBadgeBg: Color(0xFFDC2626),
    glowColor: Color(0x4DDC2626),
  );

  @override
  LockedModalThemeStyle get lockedModalStyle => const LockedModalThemeStyle(
    buttonColor: Color(0xFFDC2626),
    iconColor: Color(0xFF16A34A),
    bgColor: Color(0xFFFDF5E6),
    borderColor: Color(0x33DC2626),
    textColor: Color(0xFFB91C1C),
    icon: Icons.card_giftcard,
    title: 'Ho ho ho! 🎅',
    message: 'Esse presente ainda está sendo embrulhado!',
  );
}

class _ChristmasBackground extends StatelessWidget {
  final Widget child;
  const _ChristmasBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(child: Container(color: const Color(0xFFFDF5E6))),
        Positioned.fill(child: CustomPaint(painter: _ChristmasPatternPainter())),
        child,
      ],
    );
  }
}

class _ChristmasPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintRed = Paint()..color = const Color(0xFFDC2626).withValues(alpha: 0.03);
    final paintGreen = Paint()..color = const Color(0xFF16A34A).withValues(alpha: 0.03);

    const spacing = 50.0;
    bool useRed = true;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        final paint = useRed ? paintRed : paintGreen;
        // Draw a small star/cross
        canvas.drawLine(Offset(x - 4, y), Offset(x + 4, y), paint..strokeWidth = 1);
        canvas.drawLine(Offset(x, y - 4), Offset(x, y + 4), paint);
        canvas.drawLine(Offset(x - 3, y - 3), Offset(x + 3, y + 3), paint);
        canvas.drawLine(Offset(x + 3, y - 3), Offset(x - 3, y + 3), paint);
        useRed = !useRed;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ChristmasSnowflakes extends StatefulWidget {
  const _ChristmasSnowflakes();

  @override
  State<_ChristmasSnowflakes> createState() => _ChristmasSnowflakesState();
}

class _ChristmasSnowflakesState extends State<_ChristmasSnowflakes> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rng = Random(44);
    final icons = [LucideIcons.snowflake, LucideIcons.treePine, LucideIcons.gift, LucideIcons.star];
    final colors = [const Color(0xFFDC2626), const Color(0xFF16A34A), const Color(0xFFD4AF37)];
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(15, (i) {
            final yOff = _controller.value * 4 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 10),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 10),
              child: Opacity(
                opacity: 0.08,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Icon(icons[i % icons.length], size: 8 + rng.nextDouble() * 8, color: colors[i % colors.length]),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
