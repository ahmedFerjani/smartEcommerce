import { GetTimePipe } from './get-time.pipe';

describe('GetTimePipe', () => {
  it('create an instance', () => {
    const pipe = new GetTimePipe();
    expect(pipe).toBeTruthy();
  });
});
