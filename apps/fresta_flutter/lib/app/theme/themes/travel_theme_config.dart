import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class TravelThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'viagem';

  @override
  Color get primaryColor => const Color(0xFF0EA5E9);
  
  @override
  Color get secondaryColor => const Color(0xFFF59E0B);
  
  @override
  Color get surfaceColor => const Color(0xFFF0F9FF);

  @override
  List<Color> get headerGradient => [const Color(0xFF38BDF8), const Color(0xFF0284C7)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFF0369A1);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF075985).withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFF0F9FF);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.outfit(fontWeight: FontWeight.w800);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  String get defaultHeaderMessage => 'Novas aventuras nos aguardam!';

  @override
  String get defaultFooterMessage => 'Que nossa viagem nunca termine.';

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _TravelElements();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: const Color(0xFF0EA5E9).withValues(alpha: 0.3), width: 2),
      boxShadow: [
        BoxShadow(color: const Color(0xFF0EA5E9).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _TravelBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.plane;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _TravelBackground extends StatelessWidget {
  final Widget child;
  const _TravelBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(child: Container(color: const Color(0xFFF0F9FF))),
        Positioned.fill(child: CustomPaint(painter: _TravelPatternPainter())),
        child,
      ],
    );
  }
}

class _TravelPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF0EA5E9).withValues(alpha: 0.03)
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

class _TravelElements extends StatefulWidget {
  const _TravelElements();

  @override
  State<_TravelElements> createState() => _TravelElementsState();
}

class _TravelElementsState extends State<_TravelElements> with SingleTickerProviderStateMixin {
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
    final rng = Random(66);
    final icons = [LucideIcons.plane, LucideIcons.mapPin, LucideIcons.compass, LucideIcons.sun];
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(10, (i) {
            final yOff = _controller.value * 4 * (i % 2 == 0 ? 1 : -1);
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 16),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 16),
              child: Opacity(
                opacity: 0.07,
                child: Transform.translate(
                  offset: Offset(0, yOff),
                  child: Icon(icons[i % icons.length], size: 10 + rng.nextDouble() * 8, color: const Color(0xFF0EA5E9)),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
