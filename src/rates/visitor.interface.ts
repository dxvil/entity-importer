export interface IRatesVisitor {
  currentVisit: string;
  visitRates(visit: string);
  endVisit(visit: string);
  end();
}
