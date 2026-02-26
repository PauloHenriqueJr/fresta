import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';
import '../application/plan_limits_provider.dart';
import '../../../app/theme/theme_manager.dart';
import 'themes_selection_screen.dart';

class EditCalendarScreen extends ConsumerStatefulWidget {
  const EditCalendarScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  ConsumerState<EditCalendarScreen> createState() => _EditCalendarScreenState();
}

class _EditCalendarScreenState extends ConsumerState<EditCalendarScreen> {
  late final TextEditingController _titleController;
  late final TextEditingController _headerMessageController;
  late final TextEditingController _footerMessageController;
  late final TextEditingController _themeController;
  late final TextEditingController _passwordController;

  bool _hydrated = false;
  bool _saving = false;
  bool _clearPassword = false;
  bool _showPassword = false;
  String _privacy = 'private';
  bool _isLoadingDefaults = false;
  String? _error;
  int _themeDropdownKeyCounter = 0;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _headerMessageController = TextEditingController();
    _footerMessageController = TextEditingController();
    _themeController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _headerMessageController.dispose();
    _footerMessageController.dispose();
    _themeController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _hydrateIfNeeded() {
    if (_hydrated) return;
    final asyncDetail = ref.read(ownerCalendarDetailProvider(widget.calendarId));
    final detail = asyncDetail.maybeWhen(data: (d) => d, orElse: () => null);
    if (detail == null) return;

    _titleController.text = detail.calendar.title;

    final header = detail.calendar.headerMessage ?? '';
    final footer = detail.calendar.footerMessage ?? '';
    
    _headerMessageController.text = header;
    _footerMessageController.text = footer;

    _themeController.text = detail.calendar.themeId;
    _privacy = detail.calendar.privacy;
    _clearPassword = false;
    _hydrated = true;

    // Se campos estiverem vazios, tenta buscar defaults do banco automaticamente
    if (header.isEmpty || footer.isEmpty) {
      _loadThemeDefaults(detail.calendar.themeId, onlyIfEmpty: true);
    }
  }

  Future<void> _loadThemeDefaults(String themeId, {bool onlyIfEmpty = false}) async {
    if (_isLoadingDefaults) return;
    setState(() => _isLoadingDefaults = true);
    try {
      final defaults = await ref.read(calendarsRepositoryProvider).getThemeDefaults(themeId);
      if (mounted && defaults != null) {
        if (onlyIfEmpty) {
          setState(() {
            if (_headerMessageController.text.trim().isEmpty) {
              _headerMessageController.text = defaults.defaultHeaderMessage ?? '';
            }
            if (_footerMessageController.text.trim().isEmpty) {
              _footerMessageController.text = defaults.defaultFooterMessage ?? '';
            }
          });
        } else {
          // Manual theme change - ask to overwrite
          final shouldOverwrite = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Carregar Padrões?'),
              content: const Text('Deseja carregar as mensagens padrão deste tema? Isso irá substituir seus textos atuais.'),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Não')),
                TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sim')),
              ],
            ),
          );

          if (shouldOverwrite == true && mounted) {
            setState(() {
              _titleController.text = defaults.defaultTitle;
              _headerMessageController.text = defaults.defaultHeaderMessage ?? '';
              _footerMessageController.text = defaults.defaultFooterMessage ?? '';
            });
          }
        }
      }
    } catch (_) {
    } finally {
      if (mounted) setState(() => _isLoadingDefaults = false);
    }
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final passwordInput = _passwordController.text.trim();
      await ref.read(calendarsRepositoryProvider).updateCalendar(
            calendarId: widget.calendarId,
            title: _titleController.text.trim(),
            headerMessage: _headerMessageController.text.trim().isEmpty ? null : _headerMessageController.text.trim(),
            footerMessage: _footerMessageController.text.trim().isEmpty ? null : _footerMessageController.text.trim(),
            themeId: _themeController.text.trim(),
            privacy: _privacy,
            password: _clearPassword ? null : (passwordInput.isEmpty ? null : passwordInput),
            clearPassword: _clearPassword,
          );

      ref.invalidate(ownerCalendarDetailProvider(widget.calendarId));
      ref.invalidate(myCalendarsProvider);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Calendário atualizado com sucesso!'),
          backgroundColor: themeConfig.primaryColor,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  late var themeConfig = ThemeManager.getTheme('default');

  @override
  Widget build(BuildContext context) {
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(widget.calendarId));
    _hydrateIfNeeded();

    themeConfig = ThemeManager.getTheme(_hydrated ? _themeController.text : 'default');
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
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

        final availableThemes = ThemesSelectionScreen.themes;
        final currentThemeId = _themeController.text;
        
        // Verificamos se o tema atual existe na lista oficial
        final currentThemeItem = availableThemes.any((t) => t.id == currentThemeId) 
            ? availableThemes.firstWhere((t) => t.id == currentThemeId)
            : availableThemes.firstWhere((t) => t.id == 'aniversario');

        final currentThemeOrDefault = currentThemeItem.id;

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
                    if (_isLoadingDefaults)
                      const Padding(
                        padding: EdgeInsets.only(bottom: 16),
                        child: LinearProgressIndicator(minHeight: 2),
                      ),
                    _ThemedTextField(
                      controller: _titleController,
                      label: 'Título',
                      icon: Icons.title_rounded,
                      themeConfig: themeConfig,
                    ),
                    const SizedBox(height: 20),
                    _ThemedTextField(
                      controller: _headerMessageController,
                      label: 'Subtítulo (Opcional)',
                      icon: Icons.subtitles_rounded,
                      themeConfig: themeConfig,
                    ),
                    const SizedBox(height: 20),
                    const SizedBox(height: 20),
                    _ThemedTextField(
                      controller: TextEditingController(text: currentThemeItem.title),
                      label: 'Tema Atual (Apenas Visualização)',
                      icon: Icons.palette_rounded,
                      themeConfig: themeConfig,
                      readOnly: true,
                    ),
                    const SizedBox(height: 20),
                    _ThemedTextField(
                      controller: _footerMessageController,
                      label: 'Mensagem de Rodapé (Opcional)',
                      icon: Icons.text_snippet_rounded,
                      themeConfig: themeConfig,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Este calendário é privado. Apenas pessoas com o link (e senha, se definida) podem acessá-lo.',
                      style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13, fontStyle: FontStyle.italic),
                    ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: themeConfig.cardDecoration(context),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: themeConfig.primaryColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(Icons.password_rounded, color: themeConfig.primaryColor, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Proteção por senha',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: Theme.of(context).colorScheme.onSurface,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Restrinja o acesso ao seu calendário',
                                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Container(
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
                        ),
                        child: SwitchListTile(
                          value: _clearPassword,
                          onChanged: (value) => setState(() => _clearPassword = value),
                          activeThumbColor: themeConfig.primaryColor,
                          activeTrackColor: themeConfig.primaryColor.withValues(alpha: 0.3),
                          title: Text('Remover senha existente', style: TextStyle(fontWeight: FontWeight.w600, color: Theme.of(context).colorScheme.onSurface)),
                          subtitle: Text('Remove a proteção por senha deste calendário.', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _passwordController,
                        enabled: !_clearPassword,
                        obscureText: !_showPassword,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600),
                        decoration: InputDecoration(
                          labelText: detail.hasPassword ? 'Nova senha (opcional)' : 'Senha',
                          labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
                          prefixIcon: Icon(Icons.lock_rounded, color: themeConfig.primaryColor),
                          suffixIcon: IconButton(
                            onPressed: () => setState(() => _showPassword = !_showPassword),
                            icon: Icon(
                              _showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              color: themeConfig.primaryColor.withValues(alpha: 0.5),
                            ),
                          ),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Deixe em branco para manter a atual.',
                        style: TextStyle(color: themeConfig.textColor(context), fontSize: 12, fontStyle: FontStyle.italic),
                      ),
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
                FilledButton(
                  onPressed: _saving ? null : _save,
                  style: FilledButton.styleFrom(
                    backgroundColor: themeConfig.primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                    elevation: 0,
                  ),
                  child: _saving
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)))
                      : const Text('Salvar alterações', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
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
          'Editar Calendário',
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

  InputDecoration _themedInputDecoration(BuildContext context, String label, IconData icon) {
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
}

class _ThemedTextField extends StatelessWidget {
  const _ThemedTextField({
    required this.controller,
    required this.label,
    required this.icon,
    required this.themeConfig,
    this.maxLines = 1,
    this.readOnly = false,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final dynamic themeConfig;
  final int maxLines;
  final bool readOnly;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      readOnly: readOnly,
      style: TextStyle(
        fontSize: 16,
        color: readOnly ? colorScheme.onSurface.withValues(alpha: 0.6) : colorScheme.onSurface,
        fontWeight: FontWeight.w500,
      ),
      cursorColor: themeConfig.primaryColor,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
        prefixIcon: Icon(icon, color: themeConfig.primaryColor),
        filled: true,
        fillColor: readOnly ? colorScheme.onSurface.withValues(alpha: 0.05) : colorScheme.surface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: themeConfig.primaryColor, width: 2)),
      ),
    );
  }
}
