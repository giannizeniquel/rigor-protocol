import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'RIGOR',
  description: 'AI Constraint Protocol — Normative Specification',
  appearance: 'dark',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'RIGOR',
      description: 'AI Constraint Protocol — Normative Specification',
      themeConfig: {
        logo: '/logo-rigor.svg',
        
        nav: [
          { 
            text: 'rigor.dev', 
            link: 'https://rigor.dev' 
          },
          { 
            text: 'Specification', 
            link: '/specification/identity-core' 
          },
          { 
            text: 'Implementation', 
            link: '/implementation/' 
          }
        ],
        
        sidebar: {
          '/specification/': [
            {
              text: 'Protocol Specification',
              items: [
                { 
                  text: 'Identity Core', 
                  link: '/specification/identity-core' 
                },
                { 
                  text: 'Protocol Model', 
                  link: '/specification/protocol-model' 
                },
                { 
                  text: 'Protocol Overview', 
                  link: '/specification/protocol-overview' 
                },
                { 
                  text: 'CLI', 
                  link: '/specification/cli' 
                },
                { 
                  text: 'Differentiation', 
                  link: '/specification/differentiation' 
                }
              ]
            },
            {
              text: 'Process Specification',
              items: [
                { 
                  text: 'Spec Core', 
                  link: '/specification/spec-core' 
                },
                { 
                  text: 'Spec Reference', 
                  link: '/specification/spec-reference' 
                },
                { 
                  text: 'Events', 
                  link: '/specification/events' 
                },
                { 
                  text: 'Versioning', 
                  link: '/specification/versioning' 
                },
                { 
                  text: 'Migrations', 
                  link: '/specification/migrations' 
                },
                { 
                  text: 'Spec Appendix', 
                  link: '/specification/spec-appendix' 
                }
              ]
            }
          ],
          
          '/implementation/': [
            {
              text: 'Implementation',
              items: [
                { 
                  text: 'Introduction', 
                  link: '/implementation/' 
                },
                { 
                  text: 'Validation Engine', 
                  link: '/implementation/validation-engine' 
                },
                { 
                  text: 'Constraint Encoding', 
                  link: '/implementation/constraint-encoding' 
                },
                { 
                  text: 'CLI', 
                  link: '/implementation/cli' 
                }
              ]
            }
          ]
        },
        
        socialLinks: [
          { 
            icon: 'github', 
            link: 'https://github.com/rigor' 
          }
        ],
        
        footer: {
          message: 'AI Constraint Protocol',
          copyright: 'Specification v0.1'
        }
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      title: 'RIGOR',
      description: 'Protocolo de Restricción de IA — Especificación Normativa',
      themeConfig: {
        logo: '/logo-rigor.svg',
        
        nav: [
          { 
            text: 'rigor.dev', 
            link: 'https://rigor.dev/es/' 
          },
          { 
            text: 'Especificación', 
            link: '/es/specification/identity-core' 
          },
          { 
            text: 'Implementación', 
            link: '/es/implementation/' 
          }
        ],
        
        sidebar: {
          '/es/specification/': [
            {
              text: 'Especificación del Protocolo',
              items: [
                { 
                  text: 'Núcleo de Identidad', 
                  link: '/es/specification/identity-core' 
                },
                { 
                  text: 'Modelo del Protocolo', 
                  link: '/es/specification/protocol-model' 
                },
                { 
                  text: 'Vista General', 
                  link: '/es/specification/protocol-overview' 
                },
                { 
                  text: 'CLI', 
                  link: '/es/specification/cli' 
                },
                { 
                  text: 'Diferenciación', 
                  link: '/es/specification/differentiation' 
                }
              ]
            },
            {
              text: 'Especificación de Procesos',
              items: [
                { 
                  text: 'Núcleo de la Spec', 
                  link: '/es/specification/spec-core' 
                },
                { 
                  text: 'Referencia de la Spec', 
                  link: '/es/specification/spec-reference' 
                },
                { 
                  text: 'Eventos', 
                  link: '/es/specification/events' 
                },
                { 
                  text: 'Versionado', 
                  link: '/es/specification/versioning' 
                },
                { 
                  text: 'Migraciones', 
                  link: '/es/specification/migrations' 
                },
                { 
                  text: 'Apéndice de la Spec', 
                  link: '/es/specification/spec-appendix' 
                }
              ]
            }
          ],
          
          '/es/implementation/': [
            {
              text: 'Implementación',
              items: [
                { 
                  text: 'Introducción', 
                  link: '/es/implementation/' 
                },
                { 
                  text: 'Motor de Validación', 
                  link: '/es/implementation/validation-engine' 
                },
                { 
                  text: 'Codificación de Restricciones', 
                  link: '/es/implementation/constraint-encoding' 
                },
                { 
                  text: 'CLI', 
                  link: '/es/implementation/cli' 
                }
              ]
            }
          ]
        },
        
        socialLinks: [
          { 
            icon: 'github', 
            link: 'https://github.com/rigor' 
          }
        ],
        
        footer: {
          message: 'Protocolo de Restricción de IA',
          copyright: 'Especificación v0.1'
        }
      }
    }
  }
})
