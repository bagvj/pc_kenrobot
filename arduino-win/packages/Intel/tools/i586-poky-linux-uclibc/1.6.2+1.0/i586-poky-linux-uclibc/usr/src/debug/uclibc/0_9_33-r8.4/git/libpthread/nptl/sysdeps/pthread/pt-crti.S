#APP
	
#include "defs.h"
	
#if defined __i686 && defined __ASSEMBLER__
	
#undef __i686
	
#define __i686 __i686
	
#endif
	
/*@HEADER_ENDS*/
/*@_init_PROLOG_BEGINS*/
	.section .init
#NO_APP
	.section	.init,"ax",@progbits
	.globl	_init
	.type	_init, @function
_init:
	call	__pthread_initialize_minimal_internal
#APP
# 85 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	ALIGN
# 0 "" 2
# 86 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	END_INIT
# 0 "" 2
# 88 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	
/*@_init_PROLOG_ENDS*/
/*@_fini_PROLOG_BEGINS*/
	.section .fini
#NO_APP
	.section	.fini,"ax",@progbits
	.globl	_fini
	.type	_fini, @function
_fini:
	pushl	%ebx
	call	__x86.get_pc_thunk.bx
	addl	$_GLOBAL_OFFSET_TABLE_, %ebx
#APP
# 105 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	ALIGN
# 0 "" 2
# 106 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	END_FINI
# 0 "" 2
# 107 "libpthread/nptl/sysdeps/pthread/pt-initfini.c" 1
	
/*@_fini_PROLOG_ENDS*/
/*@TRAILER_BEGINS*/
	.section	.text.__x86.get_pc_thunk.bx,"axG",@progbits,__x86.get_pc_thunk.bx,comdat
	.globl	__x86.get_pc_thunk.bx
	.hidden	__x86.get_pc_thunk.bx
	.type	__x86.get_pc_thunk.bx, @function
__x86.get_pc_thunk.bx:
	movl	(%esp), %ebx
	ret
#NO_APP
	.hidden	__pthread_initialize_minimal_internal
	.ident	"GCC: (GNU) 4.7.2"
	.section	.note.GNU-stack,"",@progbits
