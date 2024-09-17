import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';

import { UserCircle, TrendingUp } from 'lucide-react';
import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { handleGetUserTotalUsage, handleQueryUserUsage, setFilter } from '@/redux/reducers/chatHistory.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { TIME_UNIT } from '@/domain';
import * as moment from 'moment';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const chartConfig = {
  usage: {
    label: 'In $USD',
    color: 'hsl(var(--chart-1))',
  },
};

function UsagePopover({ className }) {
  const [popoverClicked, setPopoverClicked] = React.useState(false);
  const dispatch = useDispatch();
  const { usage, userTotalUsage, filters } = useSelector((state) => state.chatHistory);

  useEffect(() => {
    if (popoverClicked) {
      dispatch(setFilter(TIME_UNIT.HISTORY.PASS_A_WEEK));
      dispatch(handleQueryUserUsage());
      dispatch(handleGetUserTotalUsage());
    }
  }, [popoverClicked, dispatch]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild onClick={() => setPopoverClicked(!popoverClicked)}>
          <Button variant="outline" size="icon" className={cn('z-10 dark:text-white dark:bg-black', className)}>
            <UserCircle />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mb-3 ml-5 p-0 border-0">
          {/* usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Here comes your gpt usage</CardTitle>
              <CardDescription className="m-0 p-0 text-sm">
                {moment(filters.fromDate).format('MMM Do YY')} - {moment(filters.toDate).format('MMM Do YY')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={usage}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="referenceDate"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex leading-none text-muted-foreground">
                Showing usage in pass 7 days <TrendingUp className="ml-1 h-4 w-4" />
              </div>
              {/* usage left */}
              <div>Usage Left</div>
              <Progress value={userTotalUsage} />
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UsagePopover;
