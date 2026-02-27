import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/theme/calendar_theme_config.dart';
import '../../shared/models/calendar_models.dart';

/// Day content data passed to themed modals.
class DayContent {
  final int dayNumber;
  final String title;
  final String message;
  final String? url;
  final String? label;
  final String? contentType;

  const DayContent({
    required this.dayNumber,
    this.title = '',
    this.message = '',
    this.url,
    this.label,
    this.contentType,
  });

  factory DayContent.fromModel(CalendarDayModel model) => DayContent(
        dayNumber: model.day,
        title: model.label ?? 'Dia ${model.day}',
        message: model.message ?? '',
        url: model.url,
        label: model.label,
        contentType: model.contentType,
      );

  bool get isVideo {
    if (url == null) return false;
    return url!.contains('youtube.com') ||
        url!.contains('youtu.be') ||
        url!.contains('tiktok.com') ||
        url!.contains('instagram.com');
  }

  bool get isMusic => contentType == 'music' || (url?.contains('spotify.com') ?? false);

  // isPhoto must come AFTER isVideo: URL-based detection takes priority over
  // content_type, mirroring the web's getRedactedContent logic.
  // A TikTok/YouTube URL saved with content_type='photo' is still a video.
  bool get isPhoto => (contentType == 'photo' || contentType == 'gif') && !isVideo && !isMusic;
  bool get isLink => contentType == 'link' || (url != null && !isPhoto && !isVideo && !isMusic);
}

/// Routes to the correct themed modal based on themeId.
/// Matches web's DaySurpriseModal behavior.
class ThemedDayModal {
  static Future<void> show(
    BuildContext context, {
    required DayContent content,
    required CalendarThemeConfig themeConfig,
  }) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => _buildModal(context, content, themeConfig),
    );
  }

  static Widget _buildModal(
    BuildContext context,
    DayContent content,
    CalendarThemeConfig themeConfig,
  ) {
    switch (themeConfig.id) {
      case 'namoro':
      case 'noivado':
      case 'bodas':
        return _LoveLetterModal(content: content, themeConfig: themeConfig);
      case 'carnaval':
      case 'saojoao':
        return _FestiveTicketModal(content: content, themeConfig: themeConfig);
      case 'natal':
        return _ChristmasModal(content: content, themeConfig: themeConfig);
      case 'aniversario':
      case 'diadascriancas':
        return _BirthdayCardModal(content: content, themeConfig: themeConfig);
      case 'casamento':
        return _WeddingCardModal(content: content, themeConfig: themeConfig);
      case 'pascoa':
        return _PascoaEggModal(content: content, themeConfig: themeConfig);
      case 'reveillon':
      case 'metas':
        return _DarkGlowModal(content: content, themeConfig: themeConfig);
      case 'diadasmaes':
        return _FloralModal(
          content: content,
          themeConfig: themeConfig,
          accent: const Color(0xFFEC4899),
          emoji: '💐',
        );
      case 'diadospais':
        return _FloralModal(
          content: content,
          themeConfig: themeConfig,
          accent: const Color(0xFF475569),
          emoji: '👔',
        );
      default:
        return _DefaultDayModal(content: content, themeConfig: themeConfig);
    }
  }
}

// ═══════════════════════════════════════════
// LOVE LETTER MODAL — namoro, noivado, bodas
// ═══════════════════════════════════════════

class _LoveLetterModal extends StatelessWidget {
  const _LoveLetterModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFFFFAFA);

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Envelope flap header
            Container(
              height: 60,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    themeConfig.primaryColor.withValues(alpha: 0.15),
                    themeConfig.primaryColor.withValues(alpha: 0.05),
                  ],
                ),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
              ),
              child: Stack(
                children: [
                  // Chevron pattern
                  CustomPaint(
                    size: const Size(double.infinity, 60),
                    painter: _ChevronPainter(color: themeConfig.primaryColor.withValues(alpha: 0.1)),
                  ),
                  // Heart seal
                  Center(
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: themeConfig.primaryColor,
                        boxShadow: [
                          BoxShadow(
                            color: themeConfig.primaryColor.withValues(alpha: 0.4),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Icon(Icons.favorite, color: Colors.white, size: 22),
                    ),
                  ),
                ],
              ),
            ),

            // Paper body with notebook lines
            Container(
              padding: const EdgeInsets.fromLTRB(32, 24, 32, 32),
              decoration: BoxDecoration(
                color: bgColor,
                image: DecorationImage(
                  image: const AssetImage('assets/images/notebook_lines.png'),
                  fit: BoxFit.cover,
                  opacity: isDark ? 0.05 : 0.15,
                  onError: (e, s) {},
                ),
              ),
              child: Stack(
                children: [
                  // Red margin line
                  Positioned(
                    left: 0,
                    top: 0,
                    bottom: 0,
                    child: Container(
                      width: 1,
                      color: themeConfig.primaryColor.withValues(alpha: 0.3),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Dia ${content.dayNumber}',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            fontStyle: FontStyle.italic,
                            color: isDark ? Colors.white : themeConfig.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 20),
                        if (content.message.isNotEmpty)
                          Text(
                            content.message,
                            style: GoogleFonts.dancingScript(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: isDark ? Colors.white70 : themeConfig.primaryColor.withValues(alpha: 0.8),
                              height: 1.6,
                            ),
                          ),
                        if (content.message.isEmpty)
                          Text(
                            'Muitas surpresas esperam por você...',
                            style: GoogleFonts.dancingScript(
                              fontSize: 18,
                              color: isDark ? Colors.white38 : themeConfig.primaryColor.withValues(alpha: 0.4),
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        const SizedBox(height: 20),
                        _buildMediaContent(context),
                        const SizedBox(height: 24),
                        // Sign off
                        Text(
                          'Com todo meu coração ❤️',
                          style: GoogleFonts.dancingScript(
                            fontSize: 14,
                            color: isDark ? Colors.white38 : themeConfig.primaryColor.withValues(alpha: 0.4),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaContent(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return Transform.rotate(
        angle: -0.02,
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.white, width: 4),
            borderRadius: BorderRadius.circular(4),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 8, offset: const Offset(2, 4)),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(2),
            child: _SafeNetworkImage(url: content.url!),
          ),
        ),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: themeConfig.primaryColor,
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// FESTIVE TICKET — carnaval, saojoao
// ═══════════════════════════════════════════

class _FestiveTicketModal extends StatelessWidget {
  const _FestiveTicketModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isCarnaval = themeConfig.id == 'carnaval';

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : themeConfig.surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Ticket header with perforated edge
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: themeConfig.headerGradient),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: themeConfig.primaryColor.withValues(alpha: 0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      isCarnaval ? '🎭 INGRESSO VIP 🎭' : '🔥 CONVITE ESPECIAL 🔥',
                      style: GoogleFonts.fredoka(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.white.withValues(alpha: 0.9),
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'DIA ${content.dayNumber}',
                      style: GoogleFonts.fredoka(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),

              // Dashed divider (ticket tear line)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  children: List.generate(
                    30,
                    (_) => Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        height: 2,
                        color: themeConfig.primaryColor.withValues(alpha: 0.2),
                      ),
                    ),
                  ),
                ),
              ),

              // Content
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : themeConfig.primaryColor,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              if (content.message.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  child: Text(
                    isCarnaval ? 'Segura a emoção! 🎉' : 'Arraiá de surpresas! 🌽',
                    style: GoogleFonts.fredoka(
                      fontSize: 18,
                      color: themeConfig.primaryColor.withValues(alpha: 0.5),
                    ),
                  ),
                ),
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: themeConfig.primaryColor,
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// CHRISTMAS MODAL — natal
// ═══════════════════════════════════════════

class _ChristmasModal extends StatelessWidget {
  const _ChristmasModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFFDF5E6),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: const Color(0xFFDC2626).withValues(alpha: 0.2)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Christmas ornament header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDC2626), Color(0xFFB91C1C)],
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF16A34A), width: 3),
                ),
                child: Column(
                  children: [
                    const Text('🎄', style: TextStyle(fontSize: 32)),
                    const SizedBox(height: 8),
                    Text(
                      'PRESENTE ${content.dayNumber}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : const Color(0xFFB91C1C),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              if (content.message.isEmpty)
                Text(
                  'Ho ho ho! 🎅',
                  style: GoogleFonts.fredoka(
                    fontSize: 20,
                    color: const Color(0xFFDC2626).withValues(alpha: 0.5),
                  ),
                ),
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: const Color(0xFFDC2626),
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// BIRTHDAY CARD — aniversario, diadascriancas
// ═══════════════════════════════════════════

class _BirthdayCardModal extends StatelessWidget {
  const _BirthdayCardModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFF0F9FF),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: themeConfig.headerGradient),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  children: [
                    const Text('🎂', style: TextStyle(fontSize: 36)),
                    const SizedBox(height: 8),
                    Text(
                      'SURPRESA ${content.dayNumber}',
                      style: GoogleFonts.fredoka(
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : themeConfig.primaryColor,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              if (content.message.isEmpty)
                Text(
                  'Parabéns! 🎉',
                  style: GoogleFonts.fredoka(
                    fontSize: 20,
                    color: themeConfig.primaryColor.withValues(alpha: 0.5),
                  ),
                ),
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: themeConfig.primaryColor,
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// WEDDING CARD — casamento
// ═══════════════════════════════════════════

class _WeddingCardModal extends StatelessWidget {
  const _WeddingCardModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    const gold = Color(0xFFD4AF37);
    const goldDark = Color(0xFF996515);

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFFDFBF7),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: gold.withValues(alpha: 0.2)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Elegant gold header
              Text(
                '💍',
                style: const TextStyle(fontSize: 40),
              ),
              const SizedBox(height: 12),
              Text(
                'Dia ${content.dayNumber}',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  fontStyle: FontStyle.italic,
                  color: isDark ? Colors.white : goldDark,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                width: 60,
                height: 2,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [gold, goldDark]),
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 16,
                    color: isDark ? Colors.white70 : goldDark.withValues(alpha: 0.8),
                    height: 1.6,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              if (content.message.isEmpty)
                Text(
                  'Uma promessa de amor eterno...',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 16,
                    fontStyle: FontStyle.italic,
                    color: gold.withValues(alpha: 0.5),
                  ),
                ),
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: const Color(0xFFD4AF37),
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// PASCOA EGG — pascoa
// ═══════════════════════════════════════════

class _PascoaEggModal extends StatelessWidget {
  const _PascoaEggModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : const Color(0xFFFDF4FF),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFA855F7), Color(0xFFEC4899)],
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  children: [
                    const Text('🥚', style: TextStyle(fontSize: 40)),
                    const SizedBox(height: 8),
                    Text(
                      'OVO ${content.dayNumber}',
                      style: GoogleFonts.fredoka(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : const Color(0xFF7E22CE),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: const Color(0xFFA855F7),
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// DARK GLOW MODAL — reveillon, metas
// ═══════════════════════════════════════════

class _DarkGlowModal extends StatelessWidget {
  const _DarkGlowModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isReveillon = themeConfig.id == 'reveillon';
    final accentColor = const Color(0xFFFBBF24);

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isReveillon ? const Color(0xFF0F172A) : const Color(0xFF1E1B4B),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: accentColor.withValues(alpha: 0.2)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [accentColor, const Color(0xFFFDE68A)],
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: accentColor.withValues(alpha: 0.4),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      isReveillon ? '🎆' : '🎯',
                      style: const TextStyle(fontSize: 36),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isReveillon ? 'SURPRESA ${content.dayNumber}' : 'META ${content.dayNumber}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: isReveillon ? const Color(0xFF0F172A) : const Color(0xFF1E1B4B),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white.withValues(alpha: 0.9),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: const Color(0xFFFBBF24),
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// FLORAL MODAL — diadasmaes, diadospais
// ═══════════════════════════════════════════

class _FloralModal extends StatelessWidget {
  const _FloralModal({
    required this.content,
    required this.themeConfig,
    required this.accent,
    required this.emoji,
  });
  final DayContent content;
  final CalendarThemeConfig themeConfig;
  final Color accent;
  final String emoji;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : themeConfig.surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: themeConfig.headerGradient),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  children: [
                    Text(emoji, style: const TextStyle(fontSize: 36)),
                    const SizedBox(height: 8),
                    Text(
                      'DIA ${content.dayNumber}',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : accent,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: accent,
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// DEFAULT MODAL — fallback
// ═══════════════════════════════════════════

class _DefaultDayModal extends StatelessWidget {
  const _DefaultDayModal({required this.content, required this.themeConfig});
  final DayContent content;
  final CalendarThemeConfig themeConfig;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.85),
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : themeConfig.surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: themeConfig.primaryColor.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(themeConfig.defaultIcon, size: 28, color: themeConfig.primaryColor),
              ),
              const SizedBox(height: 16),
              Text(
                'Dia ${content.dayNumber}',
                style: themeConfig.titleStyle.copyWith(
                  fontSize: 24,
                  color: isDark ? Colors.white : themeConfig.primaryColor,
                ),
              ),
              const SizedBox(height: 20),
              if (content.message.isNotEmpty) ...[
                Text(
                  content.message,
                  textAlign: TextAlign.center,
                  style: themeConfig.bodyStyle.copyWith(
                    fontSize: 16,
                    color: isDark ? Colors.white70 : themeConfig.primaryColor.withValues(alpha: 0.8),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
              ],
              if (content.message.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    'Surpresa! 🎉',
                    style: themeConfig.bodyStyle.copyWith(
                      fontSize: 18,
                      color: themeConfig.primaryColor.withValues(alpha: 0.4),
                    ),
                  ),
                ),
              _buildMediaWidget(context),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMediaWidget(BuildContext context) {
    if (content.isPhoto && content.url != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: _SafeNetworkImage(url: content.url!),
      );
    }
    if (content.url != null && content.url!.isNotEmpty && !content.isPhoto) {
      return _ActionButton(
        url: content.url!,
        label: content.label,
        isMusic: content.isMusic,
        color: themeConfig.primaryColor,
      );
    }
    return const SizedBox.shrink();
  }
}

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════

/// Safe image widget that handles network URLs and base64 data URIs.
/// Shows a shimmer placeholder while loading and a graceful error placeholder
/// instead of crashing with "Invalid image data".
class _SafeNetworkImage extends StatelessWidget {
  const _SafeNetworkImage({required this.url});
  final String url;

  @override
  Widget build(BuildContext context) {
    // Handle base64 data URIs (e.g. data:image/jpeg;base64,...)
    if (url.startsWith('data:image')) {
      try {
        final commaIdx = url.indexOf(',');
        if (commaIdx != -1) {
          final bytes = base64.decode(url.substring(commaIdx + 1));
          return Image.memory(
            bytes,
            fit: BoxFit.cover,
            width: double.infinity,
            errorBuilder: (c, e, s) => _errorPlaceholder(context),
          );
        }
      } catch (_) {
        return _errorPlaceholder(context);
      }
    }

    return Image.network(
      url,
      fit: BoxFit.cover,
      width: double.infinity,
      loadingBuilder: (context, child, progress) {
        if (progress == null) return child;
        return AspectRatio(
          aspectRatio: 4 / 3,
          child: Container(
            color: Colors.black12,
            child: const Center(
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        );
      },
      errorBuilder: (c, e, s) => _errorPlaceholder(context),
    );
  }

  Widget _errorPlaceholder(BuildContext context) {
    return AspectRatio(
      aspectRatio: 4 / 3,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.broken_image_outlined, size: 32, color: Colors.grey.shade400),
            const SizedBox(height: 8),
            Text(
              'Imagem não disponível',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChevronPainter extends CustomPainter {
  _ChevronPainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    for (double y = 0; y < size.height; y += 12) {
      final path = Path();
      for (double x = 0; x < size.width; x += 24) {
        path.moveTo(x, y + 6);
        path.lineTo(x + 12, y);
        path.lineTo(x + 24, y + 6);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.url,
    this.label,
    this.isMusic = false,
    required this.color,
  });

  final String url;
  final String? label;
  final bool isMusic;
  final Color color;

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
          color: isMusic
              ? const Color(0xFF1DB954).withValues(alpha: 0.1)
              : color.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isMusic
                ? const Color(0xFF1DB954).withValues(alpha: 0.3)
                : color.withValues(alpha: 0.1),
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isMusic ? const Color(0xFF1DB954) : color,
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
                      color: isMusic ? const Color(0xFF1DB954) : color,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    label ?? (isMusic ? 'Minha Música' : 'Clique para abrir'),
                    style: TextStyle(
                      color: color,
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
              color: color.withValues(alpha: 0.3),
            ),
          ],
        ),
      ),
    );
  }
}
