#ifndef GCC_TM_H
#define GCC_TM_H
#ifndef LIBC_GLIBC
# define LIBC_GLIBC 1
#endif
#ifndef LIBC_UCLIBC
# define LIBC_UCLIBC 2
#endif
#ifndef LIBC_BIONIC
# define LIBC_BIONIC 3
#endif
#ifndef TARGET_CPU_BUILD
# define TARGET_CPU_BUILD PROCESSOR_quarkse_em
#endif
#ifndef ARC_MULTILIB_CPU_DEFAULT
# define ARC_MULTILIB_CPU_DEFAULT "quarkse_em"
#endif
#ifdef IN_GCC
# include "options.h"
# include "insn-constants.h"
# include "config/arc/arc-arch.h"
# include "config/dbxelf.h"
# include "config/elfos.h"
# include "config/newlib-stdint.h"
# include "config/arc/arc.h"
# include "config/initfini-array.h"
#endif
#if defined IN_GCC && !defined GENERATOR_FILE && !defined USED_FOR_TARGET
# include "insn-flags.h"
#endif
# include "defaults.h"
#endif /* GCC_TM_H */
