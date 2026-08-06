"use client";

import { useState } from "react";
import { LuBuilding2, LuCode, LuUserRound } from "react-icons/lu";

import {
  AccountSwitcher,
  AppearanceSelector,
  Logo,
  LogoutButton,
  NotificationBell,
  RoleBadge,
  ThemeSelector,
  ThemeToggle,
  UserListItem,
  UserMenu,
  UserProfileCard,
  UserStatus,
  UserSummary,
} from "@/components/shared";
import {
  AuthLayout,
  AspectRatioBox,
  AutoGrid,
  Bleed,
  Center,
  Cluster,
  Cover,
  Container,
  DashboardLayout,
  Divider,
  Grid,
  Inline,
  Masonry,
  PageLayout,
  PublicLayout,
  ScrollArea,
  Section,
  SplitLayout,
  Stack,
  StickyRegion,
  VisuallyHidden,
} from "@/components/layout";
import {
  Blockquote,
  Caption,
  Code,
  Heading,
  Label,
  Paragraph,
  Text,
  TruncatedText,
  TypographyKbd,
} from "@/components/data-display";
import { Button } from "@/components/ui/button";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";

export function LayoutShowcase() {
  const [account, setAccount] = useState("personal");

  return (
    <>
      <ShowcaseSection id="layout" title="Layout y composición" description="Primitivas sencillas para estructurar páginas, secciones y aplicaciones.">
        <div className="space-y-4">
          <DemoBlock title="Container, Section, Stack, Inline, Grid y Divider">
            <Container size="full" className="px-0">
              <Section spacing="sm" className="py-0">
                <Stack gap="md">
                  <Inline><BadgeMock label="Inline" /><BadgeMock label="Wrap" /><BadgeMock label="Gap" /></Inline>
                  <Divider label="Grid adaptable" />
                  <Grid columns={3} gap="sm">{["Uno", "Dos", "Tres"].map((item) => <div key={item} className="rounded-lg bg-background p-4 text-center text-xs font-bold">{item}</div>)}</Grid>
                  <ScrollArea className="max-h-20 rounded-lg border border-border p-3"><p className="w-[900px] text-xs text-muted">ScrollArea mantiene el contenido desplazable sin imponer una estructura compleja.</p></ScrollArea>
                </Stack>
              </Section>
            </Container>
          </DemoBlock>
          <DemoBlock title="Center, Cluster, AutoGrid y Bleed">
            <Center maxWidth="md" className="rounded-xl bg-background py-4">
              <Cluster justify="between">
                <div>
                  <p className="text-xs font-extrabold">Composición adaptable</p>
                  <p className="text-[11px] text-muted">Sin breakpoints manuales.</p>
                </div>
                <Cluster gap="xs">
                  <BadgeMock label="Center" />
                  <BadgeMock label="Cluster" />
                </Cluster>
              </Cluster>
              <Bleed className="mt-4 border-y border-border bg-surface-hover px-5 py-3">
                <p className="text-xs text-muted">Bleed rompe únicamente el gutter elegido.</p>
              </Bleed>
              <AutoGrid minItemWidth="xs" gap="sm" className="mt-4">
                {["Auto", "Fit", "Grid"].map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-surface p-3 text-center text-xs font-bold">{item}</div>
                ))}
              </AutoGrid>
            </Center>
          </DemoBlock>
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoBlock title="AspectRatioBox, Cover y SplitLayout">
              <SplitLayout ratio="sidebar-left" className="gap-3">
                <AspectRatioBox ratio="portrait" className="grid place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-tertiary/20 text-xs font-bold">
                  3 / 4
                </AspectRatioBox>
                <Cover minHeight="sm" className="rounded-xl border border-border bg-background p-5">
                  <p className="text-sm font-extrabold">Contenido centrado</p>
                  <p className="mt-1 text-xs text-muted">Cover controla altura y alineación.</p>
                  <Button className="mt-4" size="sm">
                    <VisuallyHidden>Acción:</VisuallyHidden>
                    Continuar
                  </Button>
                </Cover>
              </SplitLayout>
            </DemoBlock>
            <DemoBlock title="Masonry y StickyRegion">
              <div className="max-h-64 overflow-auto rounded-xl bg-background p-3">
                <StickyRegion className="z-10 mb-3 rounded-lg border border-border bg-surface p-2 text-xs font-extrabold">
                  Encabezado sticky
                </StickyRegion>
                <Masonry columns={3} gap="sm">
                  {[52, 80, 64, 96, 58, 72].map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="rounded-lg bg-gradient-to-br from-secondary/15 to-primary/10 p-3 text-xs font-bold"
                      style={{ minHeight: height }}
                    >
                      Bloque {index + 1}
                    </div>
                  ))}
                </Masonry>
              </div>
            </DemoBlock>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoBlock title="PageLayout y PublicLayout">
              <PageLayout className="min-h-0 overflow-hidden rounded-lg border border-border" header={<div className="border-b border-border p-2 text-xs font-bold">Header</div>} footer={<div className="border-t border-border p-2 text-xs text-muted">Footer</div>}><div className="p-4 text-sm">PageLayout</div></PageLayout>
              <PublicLayout className="mt-3 min-h-0 overflow-hidden rounded-lg border border-border" header={<div className="p-2 text-xs font-bold">Public header</div>}><div className="p-4 text-sm">PublicLayout</div></PublicLayout>
            </DemoBlock>
            <DemoBlock title="DashboardLayout y AuthLayout">
              <DashboardLayout className="min-h-0 overflow-hidden rounded-lg border border-border" sidebar={<div className="w-20 bg-background p-2 text-[10px]">Sidebar</div>} header={<div className="border-b border-border p-2 text-xs">Topbar</div>}><div className="p-4 text-sm">DashboardLayout</div></DashboardLayout>
              <AuthLayout className="mt-3 min-h-0 overflow-hidden rounded-lg border border-border lg:grid-cols-1" title="AuthLayout" description="Composición para acceso."><Button size="sm">Continuar</Button></AuthLayout>
            </DemoBlock>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="typography" title="Tipografía" description="Jerarquía de texto con elementos HTML configurables y tonos semánticos.">
        <DemoBlock title="Heading, Text, Paragraph, Label, Caption, Code, Kbd, Blockquote y TruncatedText">
          <Stack gap="sm">
            <Heading as="h2" size="4xl">Heading 4XL</Heading>
            <Heading as="h3" size="2xl" tone="primary">Heading Primary</Heading>
            <Paragraph>Paragraph utiliza un interlineado cómodo para contenido continuo.</Paragraph>
            <Inline><Text tone="default">Default</Text><Text tone="muted">Muted</Text><Text tone="success">Success</Text><Text tone="warning">Warning</Text><Text tone="danger">Danger</Text></Inline>
            <Label>Label fuerte</Label>
            <Caption>Caption para metadatos</Caption>
            <Inline><Code>npm run dev</Code><TypographyKbd>Ctrl K</TypographyKbd></Inline>
            <Blockquote>Las interfaces claras reducen la carga cognitiva.</Blockquote>
            <TruncatedText lines={1} className="max-w-sm">Texto muy largo que se recorta automáticamente cuando supera el espacio disponible dentro del contenedor.</TruncatedText>
          </Stack>
        </DemoBlock>
      </ShowcaseSection>

      <ShowcaseSection id="identity" title="Logo, usuario y tema" description="Identidad de aplicación, resúmenes de cuenta y preferencias de apariencia.">
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Logo y variantes">
            <div className="flex flex-wrap items-center gap-6">
              <Logo name="Nexora" subtitle="Workspace" />
              <Logo name="Nexora" variant="mark" />
              <Logo name="Nexora" variant="wordmark" />
              <Logo name="Nexora" variant="vertical" icon={<LuCode />} />
              <Logo name="Nexora" variant="compact" mode="monochrome" />
            </div>
          </DemoBlock>
          <DemoBlock title="ThemeToggle, ThemeSelector y AppearanceSelector">
            <div className="space-y-3"><ThemeToggle /><ThemeSelector /><AppearanceSelector /></div>
          </DemoBlock>
          <DemoBlock title="UserMenu, UserSummary, UserListItem y ProfileCard">
            <div className="space-y-3">
              <UserMenu name="Alex Rivera" email="alex@nexora.app" onLogout={() => undefined} />
              <UserSummary name="Mara Silva" role="Product Manager" avatar={{ alt: "Mara", name: "Mara", status: "online" }} />
              <UserListItem name="Luis Ríos" role="Developer" trailing={<RoleBadge role="Admin" />} />
              <UserProfileCard name="Ana Torres" role="Designer" />
            </div>
          </DemoBlock>
          <DemoBlock title="AccountSwitcher, RoleBadge, UserStatus, NotificationBell y LogoutButton">
            <div className="flex flex-wrap items-center gap-3">
              <AccountSwitcher activeId={account} onChange={setAccount} accounts={[{ id: "personal", name: "Personal", icon: <LuUserRound /> }, { id: "company", name: "Empresa", icon: <LuBuilding2 /> }]} />
              <RoleBadge role="Owner" />
              <UserStatus status="online" />
              <NotificationBell count={8} />
              <LogoutButton>Cerrar sesión</LogoutButton>
            </div>
          </DemoBlock>
        </div>
      </ShowcaseSection>
    </>
  );
}

function BadgeMock({ label }: { label: string }) {
  return <span className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary">{label}</span>;
}
