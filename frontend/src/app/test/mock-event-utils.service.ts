export class MockEventUtilsService {
  getAvailableSeats = jasmine
    .createSpy('getAvailableSeats')
    .and.returnValue(20);
  getBookingPercentage = jasmine
    .createSpy('getBookingPercentage')
    .and.returnValue(50);
  formatPrice = jasmine.createSpy('formatPrice').and.returnValue('₦1,000');
  isEventBookable = jasmine.createSpy('isEventBookable').and.returnValue(true);
  getEventStatusText = jasmine
    .createSpy('getEventStatusText')
    .and.returnValue('active');
  getEventStatusBadgeClass = jasmine
    .createSpy('getEventStatusBadgeClass')
    .and.returnValue('bg-success');
  hasUserBookedEvent = jasmine
    .createSpy('hasUserBookedEvent')
    .and.returnValue(false);
  getBookingButtonText = jasmine
    .createSpy('getBookingButtonText')
    .and.returnValue('Book');
  isBookingButtonDisabled = jasmine
    .createSpy('isBookingButtonDisabled')
    .and.returnValue(false);
  getBookingButtonClass = jasmine
    .createSpy('getBookingButtonClass')
    .and.returnValue('btn btn-primary');
  isEventPast = jasmine.createSpy('isEventPast').and.returnValue(false);
}
