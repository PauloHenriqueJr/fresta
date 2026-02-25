import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../application/calendar_providers.dart';

class EditCalendarScreen extends ConsumerStatefulWidget {
  const EditCalendarScreen({super.key, required this.calendarId});

  final String calendarId;

  @override
  ConsumerState<EditCalendarScreen> createState() => _EditCalendarScreenState();
}

class _EditCalendarScreenState extends ConsumerState<EditCalendarScreen> {
  late final TextEditingController _titleController;
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
    _themeController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _titleController.dispose();
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

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9F5),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9F5),
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1B4D3E)),
        ),
        title: const Text(
          'Editar Calendário',
          style: TextStyle(
            color: Color(0xFF1B4D3E),
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: asyncDetail.when(
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

          return SafeArea(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 48),
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
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
                        controller: _themeController,
                        label: 'Tema (Visual)',
                        icon: Icons.palette_outlined,
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
                          fillColor: const Color(0xFFF8F9F5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'private', child: Text('Privado', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'public', child: Text('Público', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
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
                          fillColor: const Color(0xFFF8F9F5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2)),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'rascunho', child: Text('Rascunho', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'ativo', child: Text('Ativo', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'finalizado', child: Text('Finalizado', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'aguardando_pagamento', child: Text('Aguardando pgto', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
                          DropdownMenuItem(value: 'inativo', child: Text('Inativo', style: TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600))),
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
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
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
                              color: const Color(0xFFFFF7E6),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.password_rounded, color: Color(0xFFF9A03F), size: 24),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Proteção por senha',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF1B4D3E),
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Restrinja o acesso ao seu calendário',
                                  style: TextStyle(color: Color(0xFF5A7470), fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8F9F5),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                        ),
                        child: SwitchListTile(
                          value: _clearPassword,
                          onChanged: (value) => setState(() => _clearPassword = value),
                          activeThumbColor: const Color(0xFF2D7A5F),
                          title: const Text('Remover senha existente', style: TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF111827))),
                          subtitle: const Text('Isso deixará o calendário aberto se for público.', style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _passwordController,
                        enabled: !_clearPassword,
                        obscureText: !_showPassword,
                        style: const TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600),
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
                          fillColor: const Color(0xFFF8F9F5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
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
      ),
    );
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
    return TextField(
      controller: controller,
      style: const TextStyle(color: Color(0xFF111827), fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF5A7470), fontWeight: FontWeight.w600),
        prefixIcon: Icon(icon, color: const Color(0xFF2D7A5F)),
        filled: true,
        fillColor: const Color(0xFFF8F9F5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF2D7A5F), width: 2),
        ),
      ),
    );
  }
}
