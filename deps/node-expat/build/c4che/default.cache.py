AR = '/usr/bin/ar'
ARFLAGS = 'rcs'
CCFLAGS = ['-g']
CCFLAGS_MACBUNDLE = ['-fPIC']
CC_VERSION = ('4', '4', '3')
COMPILER_CXX = 'g++'
CPP = '/usr/bin/cpp'
CPPFLAGS_NODE = '-DEV_MULTIPLICITY=0'
CPPPATH_NODE = '/usr/local/include/node'
CPPPATH_ST = '-I%s'
CXX = ['/usr/bin/g++']
CXXDEFINES_ST = '-D%s'
CXXFLAGS = ['-g']
CXXFLAGS_DEBUG = ['-g']
CXXFLAGS_RELEASE = ['-O2']
CXXLNK_SRC_F = ''
CXXLNK_TGT_F = ['-o', '']
CXX_NAME = 'gcc'
CXX_SRC_F = ''
CXX_TGT_F = ['-c', '-o', '']
DEST_BINFMT = 'elf'
DEST_CPU = 'x86'
DEST_OS = 'linux'
FULLSTATIC_MARKER = '-static'
LIBDIR = '/root/.node_libraries'
LIBPATH_NODE = '/usr/local/lib'
LIBPATH_ST = '-L%s'
LIB_ST = '-l%s'
LINKFLAGS_MACBUNDLE = ['-bundle', '-undefined', 'dynamic_lookup']
LINK_CXX = ['/usr/bin/g++']
NODE_PATH = '/root/.node_libraries'
PREFIX = '/usr/local'
PREFIX_NODE = '/usr/local'
RANLIB = '/usr/bin/ranlib'
RPATH_ST = '-Wl,-rpath,%s'
SHLIB_MARKER = '-Wl,-Bdynamic'
SONAME_ST = '-Wl,-h,%s'
STATICLIBPATH_ST = '-L%s'
STATICLIB_MARKER = '-Wl,-Bstatic'
STATICLIB_ST = '-l%s'
macbundle_PATTERN = '%s.bundle'
program_PATTERN = '%s'
shlib_CXXFLAGS = ['-fPIC', '-DPIC']
shlib_LINKFLAGS = ['-shared']
shlib_PATTERN = 'lib%s.so'
staticlib_LINKFLAGS = ['-Wl,-Bstatic']
staticlib_PATTERN = 'lib%s.a'