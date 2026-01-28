import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MobileOnlyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Acesso via celular</CardTitle>
          <CardDescription>
            Por configuração, este site está disponível apenas via mobile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Abra este link no seu celular.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
