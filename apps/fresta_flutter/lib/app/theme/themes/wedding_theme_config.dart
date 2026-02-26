import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class WeddingThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'casamento';

  @override
  Color get primaryColor => const Color(0xFFB5942F);
  
  @override
  Color get secondaryColor => const Color(0xFFD4AF37);
  
  @override
  Color get surfaceColor => const Color(0xFFFDFBF7);

  @override
  List<Color> get headerGradient => [const Color(0xFFD4AF37), const Color(0xFFB5942F)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFB5942F);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFB5942F).withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFFFFCF5);
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, fontStyle: FontStyle.italic);

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => const _WeddingSparkles();

  @override
  Widget? buildHeaderComponent(BuildContext context) => null;

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.2), width: 2),
      boxShadow: [
        BoxShadow(color: const Color(0xFFD4AF37).withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    if (isDark) return Container(color: Theme.of(context).scaffoldBackgroundColor, child: child);
    return _WeddingBackground(child: child);
  }

  @override
  IconData get defaultIcon => LucideIcons.heart;

  @override
  IconData get lockedIcon => LucideIcons.lock;
}

class _WeddingBackground extends StatelessWidget {
  final Widget child;
  const _WeddingBackground({required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(child: Container(color: const Color(0xFFFFFCF5))),
        Positioned.fill(child: CustomPaint(painter: _WeddingPatternPainter())),
        child,
      ],
    );
  }
}

class _WeddingPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD4AF37).withValues(alpha: 0.03)
      ..strokeWidth = 0.5;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        // Delicate diamond pattern
        final path = Path()
          ..moveTo(x, y - 4)
          ..lineTo(x + 4, y)
          ..lineTo(x, y + 4)
          ..lineTo(x - 4, y)
          ..close();
        canvas.drawPath(path, paint..style = PaintingStyle.stroke);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _WeddingSparkles extends StatefulWidget {
  const _WeddingSparkles();

  @override
  State<_WeddingSparkles> createState() => _WeddingSparklesState();
}

class _WeddingSparklesState extends State<_WeddingSparkles> with SingleTickerProviderStateMixin {
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
    final rng = Random(11);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(10, (i) {
            final pulse = 0.03 + (_controller.value * 0.06 * (i % 3 == 0 ? 1 : 0.5));
            return Positioned(
              left: rng.nextDouble() * (MediaQuery.of(context).size.width - 10),
              top: rng.nextDouble() * (MediaQuery.of(context).size.height - 10),
              child: Opacity(
                opacity: pulse,
                child: Icon(
                  i % 2 == 0 ? LucideIcons.sparkles : LucideIcons.heart,
                  size: 8 + rng.nextDouble() * 6,
                  color: const Color(0xFFD4AF37),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}
