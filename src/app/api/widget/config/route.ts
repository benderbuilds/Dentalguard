import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/widget/config?key={embedKey}
 *
 * Public endpoint for the chatbot widget to fetch branding/config.
 * Returns only the public-safe fields needed for widget rendering.
 */
export async function GET(request: NextRequest) {
  const embedKey = request.nextUrl.searchParams.get('key')

  if (!embedKey) {
    return Response.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: config, error } = await supabase
    .from('chatbot_configs')
    .select('bot_name, welcome_message, primary_color, logo_url, office_hours, practices(name)')
    .eq('embed_key', embedKey)
    .eq('is_active', true)
    .single()

  if (error || !config) {
    return Response.json({ error: 'Widget not found or inactive' }, { status: 404 })
  }

  const practice = config.practices as unknown as { name: string }

  return Response.json(
    {
      botName: config.bot_name,
      welcomeMessage: config.welcome_message,
      primaryColor: config.primary_color,
      logoUrl: config.logo_url,
      officeHours: config.office_hours,
      practiceName: practice.name,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}

/** Handle CORS preflight */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
