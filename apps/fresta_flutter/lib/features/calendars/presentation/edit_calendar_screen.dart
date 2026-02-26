import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';
import '../../../app/theme/theme_manager.dart';

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
  String _status = 'rascunho';
  String? _error;

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

    final isDating = detail.calendar.themeId == 'namoro';
    final defaultSubtitle = isDating ? 'Uma jornada de amor para nós dois' : '';
    final defaultFooter = isDating ? '"CADA DIA AO SEU LADO É UM NOVO CAPÍTULO DA NOSSA HISTÓRIA DE AMOR. ❤️"' : '';

    _headerMessageController.text = (detail.calendar.headerMessage?.isNotEmpty == true) 
        ? detail.calendar.headerMessage! 
        : defaultSubtitle;
    _footerMessageController.text = (detail.calendar.footerMessage?.isNotEmpty == true) 
        ? detail.calendar.footerMessage! 
        : defaultFooter;

    _themeController.text = detail.calendar.themeId;
    _privacy = detail.calendar.privacy;
    _status = detail.calendar.status;
    _clearPassword = false;
    _hydrated = true;
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
            status: _status,
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

        final availableThemes = ['namoro', 'casamento', 'bodas', 'noivado', 'carnaval', 'saojoao', 'reveillon', 'natal', 'pascoa', 'aniversario', 'diadascriancas', 'diadasmaes', 'diadospais', 'viagem', 'estudo', 'independencia', 'metas'];
        final currentThemeOrDefault = availableThemes.contains(_themeController.text) ? _themeController.text : 'aniversario';

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
                    DropdownButtonFormField<String>(
                      value: currentThemeOrDefault,
                      icon: Icon(Icons.unfold_more_rounded, color: themeConfig.primaryColor.withValues(alpha: 0.5)),
                      decoration: _themedInputDecoration(context, 'Tema (Visual)', Icons.palette_rounded),
                      items: [
                        DropdownMenuItem(value: 'namoro', child: Text('Amor & Romance', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'casamento', child: Text('Nossa União', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'bodas', child: Text('Bodas', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'noivado', child: Text('Eternamente Juntos', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'carnaval', child: Text('Carnaval', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'saojoao', child: Text('São João', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'reveillon', child: Text('Réveillon', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'natal', child: Text('Natal', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'pascoa', child: Text('Páscoa', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'aniversario', child: Text('Aniversário', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'diadascriancas', child: Text('Dia das Crianças', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'diadasmaes', child: Text('Dia das Mães', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'diadospais', child: Text('Dia dos Pais', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'viagem', child: Text('Viagem', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'estudo', child: Text('Estudos', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'independencia', child: Text('Independência', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'metas', child: Text('Metas', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                      ],
                      onChanged: (value) {
                        if (value != null) {
                          setState(() {
                            _themeController.text = value;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 20),
                    _ThemedTextField(
                      controller: _footerMessageController,
                      label: 'Mensagem de Rodapé (Opcional)',
                      icon: Icons.text_snippet_rounded,
                      themeConfig: themeConfig,
                    ),
                    const SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      initialValue: _privacy,
                        icon: Icon(Icons.unfold_more_rounded, color: themeConfig.primaryColor.withValues(alpha: 0.5)),
                        decoration: _themedInputDecoration(context, 'Privacidade', Icons.lock_outline_rounded),
                        items: [
                          DropdownMenuItem(value: 'private', child: Text('Privado', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'public', child: Text('Público', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        ],
                        onChanged: (value) {
                          if (value != null) setState(() => _privacy = value);
                        },
                      ),
                      const SizedBox(height: 20),
                      DropdownButtonFormField<String>(
                        initialValue: _status,
                        icon: Icon(Icons.unfold_more_rounded, color: themeConfig.primaryColor.withValues(alpha: 0.5)),
                        decoration: _themedInputDecoration(context, 'Status', Icons.info_outline_rounded),
                        items: [
                          DropdownMenuItem(value: 'rascunho', child: Text('Rascunho', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'ativo', child: Text('Ativo', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'finalizado', child: Text('Finalizado', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'aguardando_pagamento', child: Text('Aguardando pgto', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'inativo', child: Text('Inativo', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        ],
                        onChanged: (value) {
                          if (value != null) setState(() => _status = value);
                        },
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
                          subtitle: Text('Isso deixará o calendário aberto se for público.', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant)),
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
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;
  final dynamic themeConfig;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextField(
      controller: controller,
      style: TextStyle(color: colorScheme.onSurface, fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: themeConfig.textColor(context), fontWeight: FontWeight.w600),
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
