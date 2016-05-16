// zk 420

$(document).ready(function() {
				var detail = $('#refund-reason-detail')
			$('#refund-history').on('tap', function(event) {
				var arrow = $(this).find('.arrow');
				if(arrow.hasClass('arrow-bottom')){
					arrow.removeClass('arrow-bottom').addClass('arrow-top');
					detail.hide()
				}else if(arrow.hasClass('arrow-top')){
					arrow.removeClass('arrow-top').addClass('arrow-bottom');
					detail.show()
				}
				event.preventDefault();
			});
		});