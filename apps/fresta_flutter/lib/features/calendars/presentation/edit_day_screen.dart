import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../../data/repositories/storage_repository.dart';
import '../application/calendar_providers.dart';
import '../../auth/application/auth_controller.dart';
import '../../../app/theme/theme_manager.dart';
import '../../../app/theme/calendar_theme_config.dart';
import '../../../shared/widgets/fresta_ad_banner.dart';

class EditDayScreen extends ConsumerStatefulWidget {
  const EditDayScreen({super.key, required this.calendarId, required this.day});

  final String calendarId;
  final int day;

  @override
  ConsumerState<EditDayScreen> createState() => _EditDayScreenState();
}

class _EditDayScreenState extends ConsumerState<EditDayScreen> {
  late final TextEditingController _messageController;
  late final TextEditingController _urlController;
  late final TextEditingController _labelController;
  String? _contentType;
  bool _initialized = false;
  bool _saving = false;
  bool _uploading = false;
  String? _error;
  String? _photoUrl; // URL of uploaded/existing photo
  File? _pickedFile; // Locally picked file (before upload)
  final _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _messageController = TextEditingController();
    _urlController = TextEditingController();
    _labelController = TextEditingController();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _urlController.dispose();
    _labelController.dispose();
    super.dispose();
  }

  void _maybeHydrate() {
    if (_initialized) return;
    final asyncValue = ref.read(ownerCalendarDetailProvider(widget.calendarId));
    final detail = asyncValue.maybeWhen(
      data: (data) => data,
      orElse: () => null,
    );
    final day = detail?.days.where((d) => d.day == widget.day).firstOrNull;
    if (day == null) return;

    _messageController.text = day.message ?? '';
    _labelController.text = day.label ?? '';
    _contentType = day.contentType;

    final url = day.url ?? '';
    if (day.contentType == 'photo' && url.isNotEmpty) {
      _photoUrl = url;
      _urlController.text = '';
    } else {
      _urlController.text = url;
    }

    _initialized = true;
  }

  Future<void> _pickPhoto() async {
    try {
      final picked = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1080,
        imageQuality: 80,
      );
      if (picked == null) return;
      setState(() {
        _pickedFile = File(picked.path);
        _contentType = 'photo';
      });
    } catch (e) {
      setState(() => _error = 'Erro ao selecionar foto: $e');
    }
  }

  Future<void> _takePhoto() async {
    try {
      final picked = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1080,
        imageQuality: 80,
      );
      if (picked == null) return;
      setState(() {
        _pickedFile = File(picked.path);
        _contentType = 'photo';
      });
    } catch (e) {
      setState(() => _error = 'Erro ao tirar foto: $e');
    }
  }

  Future<String?> _uploadPhotoIfNeeded() async {
    if (_pickedFile == null) return _photoUrl;

    final user = ref.read(authControllerProvider).user;
    if (user == null) return null;

    setState(() => _uploading = true);
    try {
      final url = await ref.read(storageRepositoryProvider).uploadDayImage(
        userId: user.id,
        calendarId: widget.calendarId,
        day: widget.day,
        file: _pickedFile!,
      );
      setState(() {
        _photoUrl = url;
        _pickedFile = null;
        _uploading = false;
      });
      return url;
    } catch (e) {
      setState(() {
        _uploading = false;
        _error = 'Erro ao enviar foto: $e';
      });
      return null;
    }
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      String? finalUrl;

      if (_contentType == 'photo') {
        finalUrl = await _uploadPhotoIfNeeded();
        if (finalUrl == null && _pickedFile != null) {
          // Upload failed, abort save
          setState(() => _saving = false);
          return;
        }
      } else {
        finalUrl = _urlController.text.trim().isEmpty ? null : _urlController.text.trim();
      }

      // Auto-detect content_type when user wrote a message but never chose a type
      var effectiveContentType = _contentType;
      final hasMessage = _messageController.text.trim().isNotEmpty;
      final hasUrl = (finalUrl ?? '').isNotEmpty;

      if (effectiveContentType == null && (hasMessage || hasUrl)) {
        if (hasUrl) {
          final lower = finalUrl!.toLowerCase();
          if (lower.contains('youtube.com') ||
              lower.contains('youtu.be') ||
              lower.contains('tiktok.com') ||
              lower.contains('instagram.com')) {
            effectiveContentType = 'video';
          } else if (lower.contains('spotify.com')) {
            effectiveContentType = 'music';
          } else {
            effectiveContentType = 'link';
          }
        } else {
          effectiveContentType = 'text';
        }
      }

      await ref.read(calendarsRepositoryProvider).updateDay(
        calendarId: widget.calendarId,
        day: widget.day,
        contentType: effectiveContentType,
        message: _messageController.text.trim().isEmpty
            ? null
            : _messageController.text.trim(),
        url: finalUrl,
        label: _labelController.text.trim().isEmpty
            ? null
            : _labelController.text.trim(),
      );
      ref.invalidate(ownerCalendarDetailProvider(widget.calendarId));
      if (!mounted) return;
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final colorScheme = Theme.of(context).colorScheme;
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(widget.calendarId));
    _maybeHydrate();

    final themeId = _initialized
        ? (asyncDetail.maybeWhen(
            data: (d) => d?.calendar.themeId,
            orElse: () => 'default',
          ) ?? 'default')
        : 'default';
    final themeConfig = ThemeManager.getTheme(themeId);

    Widget mainContent = asyncDetail.when(
      loading: () => Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(themeConfig.primaryColor),
        ),
      ),
      error: (error, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFDC2626)),
              const SizedBox(height: 16),
              const Text('Erro ao carregar',
                  style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF991B1B), fontSize: 18)),
              const SizedBox(height: 8),
              Text(error.toString(),
                  textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF5A7470))),
            ],
          ),
        ),
      ),
      data: (detail) {
        if (detail == null) {
          return const Center(
            child: Text('Calendário não encontrado.', style: TextStyle(color: Color(0xFF6B7280))),
          );
        }

        final isPremium = detail.calendar.isPremium;

        return SafeArea(
          bottom: false,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 48),
            children: [
              // ---- Ad Banner for free calendars (header) ----
              if (!isPremium)
                const FrestaAdBanner(position: FrestaAdPosition.header),

              // ---- Header Card ----
              Container(
                padding: const EdgeInsets.all(24),
                decoration: themeConfig.cardDecoration(context),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: themeConfig.primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(themeConfig.defaultIcon, color: themeConfig.primaryColor, size: 32),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Conteúdo do dia',
                      style: themeConfig.titleStyle.copyWith(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: themeConfig.titleColor(context),
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Crie uma mensagem especial, adicione fotos e links para surpreender neste dia.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: themeConfig.textColor(context), fontSize: 14, height: 1.4),
                    ),
                    const SizedBox(height: 24),

                    // ---- Content Type Selector (Segmented Chips) ----
                    _ContentTypeSelector(
                      value: _contentType,
                      themeConfig: themeConfig,
                      onChanged: (value) => setState(() {
                        _contentType = value;
                      }),
                    ),

                    const SizedBox(height: 20),

                    // ---- Message Field (always shown) ----
                    TextField(
                      controller: _messageController,
                      minLines: 4,
                      maxLines: 6,
                      style: TextStyle(color: colorScheme.onSurface, fontWeight: FontWeight.w500),
                      decoration: InputDecoration(
                        labelText: 'Mensagem do Dia',
                        alignLabelWithHint: true,
                        labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
                        hintText: 'Digite a surpresa ou recado para esta data...',
                        hintStyle: TextStyle(color: themeConfig.textColor(context).withValues(alpha: 0.5)),
                        filled: true,
                        fillColor: colorScheme.surface,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1))),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
                      ),
                    ),

                    // ---- Photo Picker (shown when contentType == 'photo') ----
                    if (_contentType == 'photo') ...[
                      const SizedBox(height: 20),
                      if (isPremium)
                        _buildPhotoSection(themeConfig)
                      else
                        _buildUpgradePrompt(themeConfig, 'Foto'),
                    ],

                    // ---- GIF URL Input ----
                    if (_contentType == 'gif') ...[
                      const SizedBox(height: 20),
                      _ThemedTextField(
                        controller: _urlController,
                        label: 'URL do GIF',
                        icon: Icons.gif_box_rounded,
                        hint: 'https://media.giphy.com/...',
                        themeConfig: themeConfig,
                      ),
                      if (_urlController.text.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            _urlController.text,
                            height: 160,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              height: 80,
                              decoration: BoxDecoration(
                                color: colorScheme.errorContainer,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Center(
                                child: Text('URL inválida', style: TextStyle(color: colorScheme.onErrorContainer, fontWeight: FontWeight.w600)),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],

                    // ---- Link Input ----
                    if (_contentType == 'link') ...[
                      const SizedBox(height: 20),
                      _ThemedTextField(
                        controller: _urlController,
                        label: 'URL do Link',
                        icon: Icons.link_rounded,
                        hint: 'https://...',
                        themeConfig: themeConfig,
                      ),
                      const SizedBox(height: 12),
                      _ThemedTextField(
                        controller: _labelController,
                        label: 'Título do Link',
                        icon: Icons.label_outline_rounded,
                        hint: 'Ex: Ouvir no Spotify',
                        themeConfig: themeConfig,
                      ),
                    ],

                    // ---- Music Input ----
                    if (_contentType == 'music') ...[
                      const SizedBox(height: 20),
                      _ThemedTextField(
                        controller: _urlController,
                        label: 'Link do Spotify',
                        icon: Icons.music_note_rounded,
                        hint: 'https://open.spotify.com/...',
                        themeConfig: themeConfig,
                      ),
                      const SizedBox(height: 12),
                      _ThemedTextField(
                        controller: _labelController,
                        label: 'Nome da Música (opcional)',
                        icon: Icons.label_outline_rounded,
                        hint: 'Ex: Nossa Música',
                        themeConfig: themeConfig,
                      ),
                    ],
                  ],
                ),
              ),

              if (_error != null) ...[
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFFCA5A5)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(_error!,
                            style: const TextStyle(color: Color(0xFF991B1B), fontWeight: FontWeight.w600, fontSize: 13)),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 32),

              FilledButton.icon(
                onPressed: (_saving || _uploading) ? null : _save,
                icon: (_saving || _uploading)
                    ? const SizedBox.shrink()
                    : const Icon(Icons.check_rounded, size: 22),
                label: (_saving || _uploading)
                    ? Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(_uploading ? 'Enviando foto...' : 'Salvando...',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                        ],
                      )
                    : const Text('Salvar Dia',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                style: FilledButton.styleFrom(
                  backgroundColor: themeConfig.primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                  elevation: 0,
                ),
              ),
            ],
          ),
        );
      },
    );

    Widget scaffoldContent = Scaffold(
      backgroundColor: Colors.transparent,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(Icons.arrow_back_ios_new_rounded,
              color: isDark ? Colors.white : themeConfig.primaryColor),
          style: IconButton.styleFrom(
            backgroundColor: (isDark ? Colors.white : themeConfig.primaryColor).withValues(alpha: 0.1),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        title: Text(
          'Editar Dia ${widget.day}',
          style: themeConfig.titleStyle.copyWith(
            color: isDark ? Colors.white : themeConfig.titleColor(context),
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          if (themeConfig.buildFloatingComponent(context) != null)
            Positioned.fill(child: themeConfig.buildFloatingComponent(context)!),
          mainContent,
        ],
      ),
    );

    return themeConfig.buildBackground(context, scaffoldContent);
  }

  // ---- Photo Section ----
  Widget _buildPhotoSection(CalendarThemeConfig themeConfig) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        // Preview
        if (_pickedFile != null || (_photoUrl != null && _photoUrl!.isNotEmpty)) ...[
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              children: [
                if (_pickedFile != null)
                  Image.file(
                    _pickedFile!,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  )
                else
                  Image.network(
                    _photoUrl!,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 200,
                      color: colorScheme.surfaceContainerHighest,
                      child: const Center(child: Icon(Icons.broken_image_rounded, size: 48)),
                    ),
                  ),
                // Remove button
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: () => setState(() {
                      _pickedFile = null;
                      _photoUrl = null;
                    }),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.close_rounded, color: Colors.white, size: 18),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ],

        // Pick buttons
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _pickPhoto,
                icon: Icon(Icons.photo_library_rounded, color: themeConfig.primaryColor),
                label: Text('Galeria', style: TextStyle(color: themeConfig.primaryColor, fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: themeConfig.primaryColor.withValues(alpha: 0.3)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _takePhoto,
                icon: Icon(Icons.camera_alt_rounded, color: themeConfig.primaryColor),
                label: Text('Câmera', style: TextStyle(color: themeConfig.primaryColor, fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: themeConfig.primaryColor.withValues(alpha: 0.3)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ---- Upgrade Prompt (replaces photo picker for free users) ----
  Widget _buildUpgradePrompt(CalendarThemeConfig themeConfig, String feature) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: themeConfig.primaryColor.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: themeConfig.primaryColor.withValues(alpha: 0.15)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: themeConfig.primaryColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.lock_rounded, color: themeConfig.primaryColor, size: 28),
          ),
          const SizedBox(height: 16),
          Text(
            '$feature é exclusivo do Plus',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 16,
              color: themeConfig.primaryColor,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Faça upgrade para o Fresta Plus e desbloqueie upload de fotos, mais dias e recursos premium.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: () {
              // TODO: Navigate to paywall screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Paywall em breve!')),
              );
            },
            icon: const Icon(Icons.auto_awesome_rounded, size: 18),
            label: const Text('Upgrade para Plus', style: TextStyle(fontWeight: FontWeight.w800)),
            style: FilledButton.styleFrom(
              backgroundColor: themeConfig.primaryColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ],
      ),
    );
  }
}

// ---- Content Type Selector Widget ----
class _ContentTypeSelector extends StatelessWidget {
  const _ContentTypeSelector({
    required this.value,
    required this.themeConfig,
    required this.onChanged,
  });

  final String? value;
  final CalendarThemeConfig themeConfig;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final types = [
      (id: 'text', label: 'Texto', icon: Icons.text_fields_rounded),
      (id: 'photo', label: 'Foto', icon: Icons.photo_rounded),
      (id: 'gif', label: 'GIF', icon: Icons.gif_box_rounded),
      (id: 'link', label: 'Link', icon: Icons.link_rounded),
      (id: 'music', label: 'Música', icon: Icons.music_note_rounded),
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: types.map((t) {
        final isSelected = value == t.id;
        return ChoiceChip(
          label: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(t.icon, size: 16, color: isSelected ? Colors.white : themeConfig.primaryColor),
              const SizedBox(width: 6),
              Text(t.label, style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13,
                color: isSelected ? Colors.white : colorScheme.onSurface,
              )),
            ],
          ),
          selected: isSelected,
          onSelected: (_) => onChanged(isSelected ? null : t.id),
          selectedColor: themeConfig.primaryColor,
          backgroundColor: colorScheme.surface,
          side: BorderSide(
            color: isSelected ? themeConfig.primaryColor : colorScheme.onSurface.withValues(alpha: 0.12),
          ),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          showCheckmark: false,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        );
      }).toList(),
    );
  }
}

// ---- Reusable themed text field ----
class _ThemedTextField extends StatelessWidget {
  const _ThemedTextField({
    required this.controller,
    required this.label,
    required this.icon,
    required this.themeConfig,
    this.hint,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final CalendarThemeConfig themeConfig;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextField(
      controller: controller,
      style: TextStyle(color: colorScheme.onSurface, fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
        hintStyle: TextStyle(color: themeConfig.textColor(context).withValues(alpha: 0.5), fontWeight: FontWeight.w500),
        prefixIcon: Icon(icon, color: themeConfig.primaryColor),
        filled: true,
        fillColor: colorScheme.surface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
      ),
    );
  }
}
