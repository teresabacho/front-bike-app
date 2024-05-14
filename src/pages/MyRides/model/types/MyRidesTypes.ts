
export type MyRidesTypes = {
     rides?:Array<{
          title: string,
          description: string,
          user_count: number,
          id:string
     }>,
     isLoading: boolean
     error?: unknown
}
