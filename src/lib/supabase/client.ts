import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../../types'

export const createClient = () =>
  createBrowserClient<Database>(
    'https://kmhfilbxwskbynjeuwld.supabase.co',
    'sb_publishable_2Mvlh7fUsOgt0ETMEbIdvA_oK-IvTJJ'
  )