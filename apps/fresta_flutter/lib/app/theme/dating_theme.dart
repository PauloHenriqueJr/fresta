import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../shared/models/calendar_models.dart';
import 'calendar_theme_config.dart';

class DatingTheme {
  // Cores Web Mapeadas
  static const loveRed = Color(0xFFE11D48);
  static const wineBerry = Color(0xFF881337);
  static const romancePink = Color(0xFFFFFAFA);
  static const lightRose = Color(0xFFFDF2F8);
  static const blushGradient = [Color(0xFFF43F5E), Color(0xFFEC4899)];

  static TextStyle get display {
    return GoogleFonts.playfairDisplay(
      fontWeight: FontWeight.bold,
      fontStyle: FontStyle.italic,
      color: wineBerry,
      fontSize: 32,
    );
  }

  static TextStyle get body {
    return GoogleFonts.plusJakartaSans(
      color: wineBerry.withValues(alpha: 0.8),
      fontSize: 16,
      fontWeight: FontWeight.w500,
    );
  }

  static BoxDecoration get cardDecoration {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: loveRed.withValues(alpha: 0.2), width: 2),
      boxShadow: [
        BoxShadow(
          color: loveRed.withValues(alpha: 0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }
}

class FloatingHearts extends StatefulWidget {
  const FloatingHearts({super.key});

  @override
  State<FloatingHearts> createState() => _FloatingHeartsState();
}

class _FloatingHeartsState extends State<FloatingHearts> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          children: List.generate(15, (index) {
            final yOffset = _controller.value * 5 * (index % 2 == 0 ? 1 : -1);
            return Positioned(
              left: (index * 25.0) % MediaQuery.of(context).size.width,
              top: (index * 60.0) % MediaQuery.of(context).size.height,
              child: Opacity(
                opacity: 0.1,
                child: Transform.translate(
                  offset: Offset(0, yOffset),
                  child: const Icon(Icons.favorite, color: DatingTheme.loveRed, size: 12),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

class NotebookModalContent extends StatelessWidget {
  final String content;
  final String title;
  final String? url;
  final String? label;
  final String? contentType;

  const NotebookModalContent({
    super.key,
    required this.content,
    required this.title,
    this.url,
    this.label,
    this.contentType,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? Theme.of(context).colorScheme.surfaceContainerHighest : DatingTheme.romancePink;
    final titleColor = isDark ? Colors.white : DatingTheme.wineBerry;
    final textColor = isDark ? Colors.white70 : DatingTheme.wineBerry.withValues(alpha: 0.8);
    final lineColor = isDark ? Colors.white.withValues(alpha: 0.05) : Colors.blue.withValues(alpha: 0.1);

    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Stack(
        children: [
          // Linhas horizontais (Efeito caderno)
          Positioned.fill(
            child: ListView.separated(
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (_, __) => const SizedBox(height: 30),
              separatorBuilder: (_, __) => Divider(
                color: lineColor,
                thickness: 1,
                height: 0,
              ),
              itemCount: 20,
            ),
          ),
          // Linha vertical vermelha
          Positioned(
            left: 20,
            top: 0,
            bottom: 0,
            child: Container(
              width: 1,
              color: DatingTheme.loveRed.withValues(alpha: 0.3),
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: DatingTheme.display.copyWith(fontSize: 24, color: titleColor)),
              const SizedBox(height: 24),
              Text(content, style: DatingTheme.body.copyWith(color: textColor)),
              const SizedBox(height: 24),
              if (contentType == 'photo' && url?.isNotEmpty == true) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    url!,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 24),
              ],
              if (url?.isNotEmpty == true && contentType != 'photo') ...[
                const SizedBox(height: 8),
                _ActionLink(url: url!, label: label, isMusic: contentType == 'music'),
                const SizedBox(height: 16),
              ],
              const SizedBox(height: 24),
            ],
          ),
        ],
      ),
    );
  }
}

class DayContentModal extends StatelessWidget {
  const DayContentModal({
    super.key,
    required this.day,
    required this.themeConfig,
  });

  final CalendarDayModel day;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    // Unificando a visualização para todos os temas usando o NotebookModalContent como base
    // mas com as cores e estilos do tema atual.
    return NotebookModalContent(
      title: 'Dia ${day.day}',
      content: (day.message ?? '').trim().isEmpty 
          ? 'Muitas surpresas esperam por você...' 
          : day.message!,
      url: day.url,
      label: day.label,
      contentType: day.contentType,
    );
  }
}

class _ActionLink extends StatelessWidget {
  const _ActionLink({required this.url, this.label, this.isMusic = false});

  final String url;
  final String? label;
  final bool isMusic;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        final uri = Uri.tryParse(url.trim());
        if (uri != null) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isMusic ? const Color(0xFF1DB954).withValues(alpha: 0.1) : DatingTheme.loveRed.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isMusic ? const Color(0xFF1DB954).withValues(alpha: 0.3) : DatingTheme.loveRed.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isMusic ? const Color(0xFF1DB954) : DatingTheme.loveRed,
                shape: BoxShape.circle,
              ),
              child: Icon(
                isMusic ? Icons.music_note_rounded : Icons.link_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isMusic ? 'OUVIR NO SPOTIFY' : 'ABRIR LINK',
                    style: TextStyle(
                      color: isMusic ? const Color(0xFF1DB954) : DatingTheme.loveRed,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    label ?? (isMusic ? 'Minha Música' : 'Clique para abrir'),
                    style: TextStyle(
                      color: DatingTheme.wineBerry,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios_rounded,
              size: 14,
              color: DatingTheme.wineBerry.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }
}

class HangingHeartsHeader extends StatelessWidget {
  const HangingHeartsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      width: double.infinity,
      child: Stack(
        children: [
          ...List.generate(6, (index) {
            final double left = 30.0 + (index * 60.0);
            final double height = 40.0 + (index % 3 * 20.0);
            return Positioned(
              left: left,
              top: 0,
              child: Column(
                children: [
                  Container(
                    width: 1,
                    height: height,
                    color: DatingTheme.loveRed.withValues(alpha: 0.3),
                  ),
                  Icon(
                    Icons.favorite,
                    size: 16,
                    color: DatingTheme.loveRed.withValues(alpha: index % 2 == 0 ? 0.6 : 0.4),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class DatingBackground extends StatelessWidget {
  final Widget child;
  const DatingBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: CustomPaint(
            painter: _PatternPainter(),
          ),
        ),
        child,
      ],
    );
  }
}

class _PatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = DatingTheme.loveRed.withValues(alpha: 0.03)
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        // Draw a small '+'
        canvas.drawLine(Offset(x - 3, y), Offset(x + 3, y), paint);
        canvas.drawLine(Offset(x, y - 3), Offset(x, y + 3), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
