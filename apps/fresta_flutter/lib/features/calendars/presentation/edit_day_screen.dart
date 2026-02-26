import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';
import '../../../app/theme/theme_manager.dart';
import '../../../app/theme/calendar_theme_config.dart';

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
  String? _error;

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
    
    final url = day.url ?? '';
    if (day.contentType == 'link' || !url.contains('supabase.co')) {
      _urlController.text = url;
    } else {
      _urlController.text = '';
    }
    
    _labelController.text = day.label ?? '';
    _contentType = day.contentType;
    _initialized = true;
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      await ref.read(calendarsRepositoryProvider).updateDay(
            calendarId: widget.calendarId,
            day: widget.day,
            contentType: _contentType,
            message: _messageController.text.trim().isEmpty
                ? null
                : _messageController.text.trim(),
            url: _urlController.text.trim().isEmpty ? null : _urlController.text.trim(),
            label: _labelController.text.trim().isEmpty ? null : _labelController.text.trim(),
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
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(widget.calendarId));
    _maybeHydrate();

    final themeId = _initialized
        ? (asyncDetail.maybeWhen(data: (d) => d?.calendar.themeId, orElse: () => 'default') ?? 'default')
        : 'default';
    final themeConfig = ThemeManager.getTheme(themeId);

    Widget mainContent = asyncDetail.when(
      loading: () => Center(
        child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(themeConfig.primaryColor)),
      ),
      error: (error, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFDC2626)),
              const SizedBox(height: 16),
              const Text('Erro ao carregar', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF991B1B), fontSize: 18)),
              const SizedBox(height: 8),
              Text(error.toString(), textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF5A7470))),
            ],
          ),
        ),
      ),
      data: (detail) {
        if (detail == null) {
          return const Center(child: Text('Calendário não encontrado.', style: TextStyle(color: Color(0xFF6B7280))));
        }

        return SafeArea(
          bottom: false,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 48),
            children: [
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
                        'Crie uma mensagem especial, adicione fotos, vídeos e links para surpreender neste dia.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: themeConfig.textColor(context), fontSize: 14, height: 1.4),
                      ),
                      const SizedBox(height: 24),
                      DropdownButtonFormField<String?>(
                        initialValue: _contentType,
                        icon: Icon(Icons.unfold_more_rounded, color: themeConfig.primaryColor.withValues(alpha: 0.5)),
                        decoration: _themedInputDecoration(context, themeConfig, 'Tipo de conteúdo', Icons.category_outlined),
                        items: [
                          DropdownMenuItem<String?>(value: null, child: Text('Sem tipo definido', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem<String?>(value: 'text', child: Text('Apenas Texto', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem<String?>(value: 'photo', child: Text('Foto ou Galeria', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem<String?>(value: 'gif', child: Text('Desafio ou GIF', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem<String?>(value: 'link', child: Text('Redirecionamento / Link', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem<String?>(value: 'music', child: Text('Música Spotify', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        ],
                        onChanged: (value) => setState(() => _contentType = value),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _messageController,
                        minLines: 4,
                        maxLines: 6,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w500),
                        decoration: InputDecoration(
                          labelText: 'Mensagem do Dia',
                          alignLabelWithHint: true,
                          labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
                          hintText: 'Digite a surpresa ou recado para esta data...',
                          hintStyle: TextStyle(color: themeConfig.textColor(context).withValues(alpha: 0.5)),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
                        ),
                      ),
                      const SizedBox(height: 20),
                      _ThemedTextField(controller: _urlController, label: 'URL ou Link (Opcional)', icon: Icons.link_rounded, hint: 'https://...', themeConfig: themeConfig),
                      const SizedBox(height: 20),
                      _ThemedTextField(controller: _labelController, label: 'Rótulo do Link', icon: Icons.label_outline_rounded, hint: 'Ex: Ouvir no Spotify', themeConfig: themeConfig),
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
                        Expanded(child: Text(_error!, style: const TextStyle(color: Color(0xFF991B1B), fontWeight: FontWeight.w600, fontSize: 13))),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 32),
                FilledButton.icon(
                  onPressed: _saving ? null : _save,
                  icon: _saving ? const SizedBox.shrink() : const Icon(Icons.check_rounded, size: 22),
                  label: _saving
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)))
                      : const Text('Salvar Dia', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
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
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDark ? Colors.white : themeConfig.primaryColor),
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
}

InputDecoration _themedInputDecoration(BuildContext context, CalendarThemeConfig themeConfig, String label, IconData icon) {
  return InputDecoration(
    labelText: label,
    labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
    prefixIcon: Icon(icon, color: themeConfig.primaryColor),
    filled: true,
    fillColor: Theme.of(context).colorScheme.surface,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
  );
}

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

extension IterableFirstOrNull<T> on Iterable<T> {
  T? get firstOrNull => isEmpty ? null : first;
}
