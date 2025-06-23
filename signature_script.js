const myElement = document.getElementById('top_content');

function updateTopContentBlockLocation(element, topChildElement, oldValueX, paddingTopOrigin) {
    const newValue = element.getBoundingClientRect();
    let newValueX = newValue.x;
    if (oldValueX != newValueX) {
        if (newValueX <= 20) {
            topChildElement.style.paddingTop = "20px";
        } else {
            topChildElement.style.paddingTop = paddingTopOrigin;
        }
    }
    return newValueX;
}

var oldAddressX = 0;
var oldContactX = 0;
const resizeObserver = new ResizeObserver(entries => {
    const addressData = document.getElementById('address_data');
    const addressTitle = document.getElementById('address_title');
    oldAddressX = updateTopContentBlockLocation(addressData, addressTitle, oldAddressX, "31px");

    const contactData = document.getElementById('contact_data');
    const contactName = document.getElementById('contact_name');
    oldContactX = updateTopContentBlockLocation(contactData, contactName, oldContactX, "0px");
});

resizeObserver.observe(myElement);