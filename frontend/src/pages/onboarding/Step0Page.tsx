import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Target, DollarSign } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { profileApi } from '../../lib/api'
import { Button, Input, TextArea } from '../../components/ui'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { HeptagramChart } from '../../components/Dashboard'

const HEPTAGRAM_QUESTIONS = [
  { key: 'tecnica', label: 'Técnica de Vendas', description: 'Domínio de técnicas de fechamento e negociação' },
  { key: 'venda', label: 'Capacidade de Venda', description: 'Habilidade de converter leads em clientes' },
  { key: 'comunicacao', label: 'Comunicação', description: 'Clareza e persuasão na comunicação' },
  { key: 'lideranca', label: 'Liderança', description: 'Capacidade de liderar e influenciar' },
  { key: 'resiliencia', label: 'Resiliência', description: 'Capacidade de superar objeções e rejeições' },
  { key: 'organizacao', label: 'Organização', description: 'Gestão de tempo e pipeline de vendas' },
  { key: 'mindset', label: 'Mindset', description: 'Mentalidade de crescimento e abundância' },
]

export function Step0Page() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [financialGoal, setFinancialGoal] = useState(10000)
  const [dreamDescription, setDreamDescription] = useState('')
  const [scores, setScores] = useState<Record<string, number>>({
    tecnica: 5,
    venda: 5,
    comunicacao: 5,
    lideranca: 5,
    resiliencia: 5,
    organizacao: 5,
    mindset: 5,
  })

  const handleScoreChange = (key: string, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[Step0] Submit iniciado')
    setError('')
    setLoading(true)

    try {
      console.log('[Step0] Enviando dados:', { fullName, phone, pixKey, financialGoal })
      const result = await profileApi.completeStep0({
        full_name: fullName,
        phone,
        pix_key: pixKey,
        financial_goal: financialGoal,
        dream_description: dreamDescription,
        heptagram_scores: scores,
      })
      console.log('[Step0] Resultado:', result)
      
      await refreshProfile()
      navigate('/')
    } catch (err) {
      console.error('[Step0] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border-2 border-primary mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-cream tracking-wider mb-2">
            BEM-VINDO, RECRUTA
          </h1>
          <p className="text-sand">
            Inicie seu briefing preenchendo seus dados táticos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Operador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome de guerra"
                  required
                />
                <Input
                  label="Telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Chave PIX"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CPF, Email ou Chave Aleatória"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input de Sonhos */}
          <Card variant="highlight">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <CardTitle>Input de Sonhos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sand uppercase tracking-wider mb-2">
                    Meta Financeira Mensal
                  </label>
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={financialGoal}
                      onChange={(e) => setFinancialGoal(Number(e.target.value))}
                      className="flex-1 h-2 bg-background appearance-none cursor-pointer accent-primary"
                    />
                    <span className="font-display text-2xl text-cream min-w-[140px] text-right">
                      R$ {financialGoal.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <TextArea
                  label="Descreva seus sonhos e objetivos"
                  value={dreamDescription}
                  onChange={(e) => setDreamDescription(e.target.value)}
                  placeholder="O que você deseja conquistar? Quais são seus objetivos pessoais e profissionais?"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Heptagrama */}
          <Card>
            <CardHeader>
              <CardTitle>Quizz Heptagrama - Perfil Tático</CardTitle>
              <p className="text-sand text-sm mt-2">
                Avalie suas habilidades de 1 a 10 em cada dimensão
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {HEPTAGRAM_QUESTIONS.map((q) => (
                    <div key={q.key} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-cream text-sm font-medium">{q.label}</label>
                        <span className="font-display text-primary">{scores[q.key]}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scores[q.key]}
                        onChange={(e) => handleScoreChange(q.key, Number(e.target.value))}
                        className="w-full h-2 bg-background appearance-none cursor-pointer accent-primary"
                      />
                      <p className="text-sand text-xs">{q.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center bg-background/50 p-4">
                  <HeptagramChart scores={scores} />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-900/30 border border-red-800 p-4 text-red-300">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            isLoading={loading}
            onClick={() => console.log('[Step0] Botão clicado')}
          >
            Confirmar Dados e Avançar
          </Button>
        </form>
      </div>
    </div>
  )
}
