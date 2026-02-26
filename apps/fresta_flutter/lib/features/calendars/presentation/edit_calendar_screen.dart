import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';
import '../../../app/theme/dating_theme.dart';

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
          backgroundColor: const Color(0xFF2D7A5F),
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

  @override
  Widget build(BuildContext context) {
    final asyncDetail = ref.watch(ownerCalendarDetailProvider(widget.calendarId));
    _hydrateIfNeeded();

    final isDating = _hydrated && _themeController.text == 'namoro';
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    Widget mainContent = asyncDetail.when(
      loading: () => const Center(
        child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2D7A5F))),
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

        final availableThemes = ['aniversario', 'namoro', 'viagem', 'casamento', 'natal'];
        final currentThemeOrDefault = availableThemes.contains(_themeController.text) ? _themeController.text : 'aniversario';

        return SafeArea(
          bottom: false,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 48),
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: isDating 
                      ? (Theme.of(context).brightness == Brightness.dark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white.withValues(alpha: 0.95))
                      : Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: isDating ? Border.all(color: DatingTheme.loveRed.withValues(alpha: 0.1)) : null,
                  boxShadow: const [
                    BoxShadow(color: Color(0x04000000), blurRadius: 16, offset: Offset(0, 4)),
                  ],
                ),
                child: Column(
                  children: [
                    _StyledTextField(
                      controller: _titleController,
                      label: 'Título',
                      icon: Icons.title_rounded,
                    ),
                    const SizedBox(height: 20),
                    _StyledTextField(
                      controller: _headerMessageController,
                      label: 'Subtítulo (Opcional)',
                      icon: Icons.subtitles_rounded,
                    ),
                    const SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      value: currentThemeOrDefault,
                      icon: const Icon(Icons.palette_outlined, color: Color(0xFF9CA3AF)),
                      decoration: InputDecoration(
                        labelText: 'Tema (Visual)',
                        labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                        prefixIcon: const Icon(Icons.palette_rounded, color: Color(0xFF2D7A5F)),
                        filled: true,
                        fillColor: Theme.of(context).colorScheme.surface,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                      ),
                      items: [
                        DropdownMenuItem(value: 'aniversario', child: Text('Aniversário', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'namoro', child: Text('Namoro', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'viagem', child: Text('Viagem', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'casamento', child: Text('Casamento', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
                        DropdownMenuItem(value: 'natal', child: Text('Natal', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w600))),
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
                    _StyledTextField(
                      controller: _footerMessageController,
                      label: 'Mensagem de Rodapé (Opcional)',
                      icon: Icons.text_snippet_rounded,
                    ),
                    const SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      initialValue: _privacy,
                        icon: const Icon(Icons.unfold_more_rounded, color: Color(0xFF9CA3AF)),
                        decoration: InputDecoration(
                          labelText: 'Privacidade',
                          labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                          prefixIcon: const Icon(Icons.lock_outline_rounded, color: Color(0xFF2D7A5F)),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                        ),
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
                        icon: const Icon(Icons.unfold_more_rounded, color: Color(0xFF9CA3AF)),
                        decoration: InputDecoration(
                          labelText: 'Status',
                          labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                          prefixIcon: const Icon(Icons.info_outline_rounded, color: Color(0xFF2D7A5F)),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                        ),
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
                  decoration: BoxDecoration(
                    color: isDating 
                        ? (Theme.of(context).brightness == Brightness.dark ? Theme.of(context).colorScheme.surfaceContainerHighest : Colors.white.withValues(alpha: 0.95))
                        : Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(24),
                    border: isDating ? Border.all(color: DatingTheme.loveRed.withValues(alpha: 0.1)) : null,
                    boxShadow: const [
                      BoxShadow(color: Color(0x04000000), blurRadius: 16, offset: Offset(0, 4)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF452B11) : const Color(0xFFFFF7E6),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.password_rounded, color: Color(0xFFF9A03F), size: 24),
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
                          activeThumbColor: const Color(0xFF2D7A5F),
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
                          labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
                          prefixIcon: const Icon(Icons.lock_rounded, color: Color(0xFF2D7A5F)),
                          suffixIcon: IconButton(
                            onPressed: () => setState(() => _showPassword = !_showPassword),
                            icon: Icon(
                              _showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              color: const Color(0xFF9CA3AF),
                            ),
                          ),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Deixe em branco para manter a atual.',
                        style: TextStyle(color: Color(0xFF6B7280), fontSize: 12, fontStyle: FontStyle.italic),
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
                    backgroundColor: const Color(0xFF1B4D3E),
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
      backgroundColor: isDating ? Colors.transparent : Theme.of(context).scaffoldBackgroundColor,
      extendBodyBehindAppBar: isDating,
      appBar: AppBar(
        backgroundColor: isDating ? Colors.transparent : Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: isDating ? DatingTheme.loveRed : Theme.of(context).colorScheme.onSurface),
        ),
        title: Text(
          'Editar Calendário',
          style: TextStyle(
            color: isDating ? (isDark ? Colors.white : DatingTheme.wineBerry) : Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          if (isDating) const HangingHeartsHeader(),
          mainContent,
        ],
      ),
    );

    return isDating ? DatingBackground(child: scaffoldContent) : scaffoldContent;
  }
}

class _StyledTextField extends StatelessWidget {
  const _StyledTextField({
    required this.controller,
    required this.label,
    required this.icon,
  });

  final TextEditingController controller;
  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return TextField(
      controller: controller,
      style: TextStyle(color: colorScheme.onSurface, fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: const Color(0xFF5A7470), fontWeight: FontWeight.w600),
        prefixIcon: Icon(icon, color: const Color(0xFF2D7A5F)),
        filled: true,
        fillColor: colorScheme.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colorScheme.onSurface.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2),
        ),
      ),
    );
  }
}
